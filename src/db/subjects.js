import { getDB } from './database';

const MAX_SUBJECTS_PER_SEMESTER = 10;

/**
 * Get all subjects for a semester.
 * @param {string} semesterId
 * @returns {Promise<Array>}
 */
export async function getSubjectsBySemester(semesterId) {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('subjects', 'semesterId', semesterId);
  } catch (error) {
    console.error('Failed to get subjects by semester:', error);
    throw error;
  }
}

/**
 * Get a single subject by ID.
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
export async function getSubject(id) {
  try {
    const db = await getDB();
    return await db.get('subjects', id);
  } catch (error) {
    console.error('Failed to get subject:', error);
    throw error;
  }
}

/**
 * Get the count of subjects for a semester.
 * @param {string} semesterId
 * @returns {Promise<number>}
 */
export async function getSubjectCount(semesterId) {
  try {
    const db = await getDB();
    const subjects = await db.getAllFromIndex('subjects', 'semesterId', semesterId);
    return subjects.length;
  } catch (error) {
    console.error('Failed to get subject count:', error);
    throw error;
  }
}

/**
 * Create a new subject.
 * @param {{ semesterId: string, name: string, code: string, credits: number, type: 'theory'|'lab'|'integrated', targetGrade: string, gradingMethod: 'absolute'|'relative' }} data
 * @returns {Promise<Object>} The created subject
 */
export async function createSubject({ semesterId, name, code, credits, type, targetGrade, gradingMethod }) {
  try {
    if (!credits || credits <= 0) {
      throw new Error('Credits must be greater than 0');
    }

    const db = await getDB();

    // Check subject count for this semester
    const existingSubjects = await db.getAllFromIndex('subjects', 'semesterId', semesterId);
    if (existingSubjects.length >= MAX_SUBJECTS_PER_SEMESTER) {
      throw new Error(`Maximum of ${MAX_SUBJECTS_PER_SEMESTER} subjects per semester reached`);
    }

    const now = new Date().toISOString();
    const subject = {
      id: crypto.randomUUID(),
      semesterId,
      name,
      code,
      credits,
      type,
      targetGrade,
      gradingMethod,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('subjects', subject);
    return subject;
  } catch (error) {
    console.error('Failed to create subject:', error);
    throw error;
  }
}

/**
 * Update a subject with partial data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} The updated subject
 */
export async function updateSubject(id, updates) {
  try {
    const db = await getDB();
    const subject = await db.get('subjects', id);
    if (!subject) {
      throw new Error(`Subject with id ${id} not found`);
    }

    if (updates.credits !== undefined && updates.credits <= 0) {
      throw new Error('Credits must be greater than 0');
    }

    const updatedSubject = {
      ...subject,
      ...updates,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    await db.put('subjects', updatedSubject);
    return updatedSubject;
  } catch (error) {
    console.error('Failed to update subject:', error);
    throw error;
  }
}

/**
 * Delete a subject and cascade delete all related assessments and exams.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteSubject(id) {
  try {
    const db = await getDB();
    const tx = db.transaction(
      ['subjects', 'assessments', 'exams', 'gradingPolicies'],
      'readwrite'
    );

    // Delete all assessments for this subject
    const assessmentStore = tx.objectStore('assessments');
    const subjectAssessments = await assessmentStore.index('subjectId').getAll(id);
    for (const assessment of subjectAssessments) {
      await assessmentStore.delete(assessment.id);
    }

    // Delete all exams for this subject
    const examStore = tx.objectStore('exams');
    const subjectExams = await examStore.index('subjectId').getAll(id);
    for (const exam of subjectExams) {
      await examStore.delete(exam.id);
    }

    // Delete grading policies for this subject
    const gradingStore = tx.objectStore('gradingPolicies');
    const subjectPolicies = await gradingStore.index('subjectId').getAll(id);
    for (const policy of subjectPolicies) {
      await gradingStore.delete(policy.id);
    }

    // Delete the subject itself
    await tx.objectStore('subjects').delete(id);

    await tx.done;
  } catch (error) {
    console.error('Failed to delete subject:', error);
    throw error;
  }
}
