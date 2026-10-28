import { getDB } from './database';

/**
 * Get all semesters.
 * @returns {Promise<Array>}
 */
export async function getAllSemesters() {
  try {
    const db = await getDB();
    return await db.getAll('semesters');
  } catch (error) {
    console.error('Failed to get all semesters:', error);
    throw error;
  }
}

/**
 * Get a single semester by ID.
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
export async function getSemester(id) {
  try {
    const db = await getDB();
    return await db.get('semesters', id);
  } catch (error) {
    console.error('Failed to get semester:', error);
    throw error;
  }
}

/**
 * Get the currently active semester.
 * @returns {Promise<Object|undefined>}
 */
export async function getActiveSemester() {
  try {
    const db = await getDB();
    const allSemesters = await db.getAllFromIndex('semesters', 'isActive', true);
    return allSemesters[0];
  } catch (error) {
    console.error('Failed to get active semester:', error);
    throw error;
  }
}

/**
 * Create a new semester.
 * @param {{ name: string, year: string, isActive?: boolean }} data
 * @returns {Promise<Object>} The created semester
 */
export async function createSemester({ name, year, isActive = false }) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const semester = {
      id: crypto.randomUUID(),
      name,
      year,
      isActive,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    // If this semester should be active, deactivate all others
    if (isActive) {
      const tx = db.transaction('semesters', 'readwrite');
      const store = tx.objectStore('semesters');
      const allSemesters = await store.getAll();
      for (const s of allSemesters) {
        if (s.isActive) {
          s.isActive = false;
          s.updatedAt = now;
          await store.put(s);
        }
      }
      await store.add(semester);
      await tx.done;
    } else {
      await db.add('semesters', semester);
    }

    return semester;
  } catch (error) {
    console.error('Failed to create semester:', error);
    throw error;
  }
}

/**
 * Update a semester with partial data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} The updated semester
 */
export async function updateSemester(id, updates) {
  try {
    const db = await getDB();
    const semester = await db.get('semesters', id);
    if (!semester) {
      throw new Error(`Semester with id ${id} not found`);
    }

    const updatedSemester = {
      ...semester,
      ...updates,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    await db.put('semesters', updatedSemester);
    return updatedSemester;
  } catch (error) {
    console.error('Failed to update semester:', error);
    throw error;
  }
}

/**
 * Set a semester as the active semester, deactivating all others.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function setActiveSemester(id) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const tx = db.transaction('semesters', 'readwrite');
    const store = tx.objectStore('semesters');
    const allSemesters = await store.getAll();

    for (const semester of allSemesters) {
      const shouldBeActive = semester.id === id;
      if (semester.isActive !== shouldBeActive) {
        semester.isActive = shouldBeActive;
        semester.updatedAt = now;
        await store.put(semester);
      }
    }

    await tx.done;
  } catch (error) {
    console.error('Failed to set active semester:', error);
    throw error;
  }
}

/**
 * Archive a semester.
 * @param {string} id
 * @returns {Promise<Object>} The archived semester
 */
export async function archiveSemester(id) {
  try {
    return await updateSemester(id, { isArchived: true, isActive: false });
  } catch (error) {
    console.error('Failed to archive semester:', error);
    throw error;
  }
}

/**
 * Delete a semester and cascade delete all related subjects, assessments, exams, and grading policies.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteSemester(id) {
  try {
    const db = await getDB();
    const tx = db.transaction(
      ['semesters', 'subjects', 'assessments', 'exams', 'gradingPolicies'],
      'readwrite'
    );

    // Delete all assessments for this semester
    const assessmentStore = tx.objectStore('assessments');
    const semesterAssessments = await assessmentStore.index('semesterId').getAll(id);
    for (const assessment of semesterAssessments) {
      await assessmentStore.delete(assessment.id);
    }

    // Delete all exams for this semester
    const examStore = tx.objectStore('exams');
    const semesterExams = await examStore.index('semesterId').getAll(id);
    for (const exam of semesterExams) {
      await examStore.delete(exam.id);
    }

    // Delete all grading policies for this semester
    const gradingStore = tx.objectStore('gradingPolicies');
    const semesterPolicies = await gradingStore.index('semesterId').getAll(id);
    for (const policy of semesterPolicies) {
      await gradingStore.delete(policy.id);
    }

    // Delete all subjects for this semester
    const subjectStore = tx.objectStore('subjects');
    const semesterSubjects = await subjectStore.index('semesterId').getAll(id);
    for (const subject of semesterSubjects) {
      await subjectStore.delete(subject.id);
    }

    // Delete the semester itself
    await tx.objectStore('semesters').delete(id);

    await tx.done;
  } catch (error) {
    console.error('Failed to delete semester:', error);
    throw error;
  }
}
