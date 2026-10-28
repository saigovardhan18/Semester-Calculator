import { getDB } from './database';

/**
 * Get all assessments for a subject.
 * @param {string} subjectId
 * @returns {Promise<Array>}
 */
export async function getAssessmentsBySubject(subjectId) {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('assessments', 'subjectId', subjectId);
  } catch (error) {
    console.error('Failed to get assessments by subject:', error);
    throw error;
  }
}

/**
 * Get all assessments for a semester.
 * @param {string} semesterId
 * @returns {Promise<Array>}
 */
export async function getAssessmentsBySemester(semesterId) {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('assessments', 'semesterId', semesterId);
  } catch (error) {
    console.error('Failed to get assessments by semester:', error);
    throw error;
  }
}

/**
 * Get the total weightage of all assessments for a subject.
 * @param {string} subjectId
 * @returns {Promise<number>}
 */
export async function getAssessmentWeightageTotal(subjectId) {
  try {
    const db = await getDB();
    const assessments = await db.getAllFromIndex('assessments', 'subjectId', subjectId);
    return assessments.reduce((total, a) => total + (a.weightage || 0), 0);
  } catch (error) {
    console.error('Failed to get assessment weightage total:', error);
    throw error;
  }
}

/**
 * Create a new assessment.
 * @param {{ subjectId: string, semesterId: string, name: string, rawMaximum: number, weightage: number, marksScored: number|null, classAverage: number|null, classAverageType: 'raw'|'weighted', status: 'pending'|'completed'|'exempted' }} data
 * @returns {Promise<Object>} The created assessment
 */
export async function createAssessment({
  subjectId,
  semesterId,
  name,
  rawMaximum,
  weightage,
  marksScored = null,
  classAverage = null,
  classAverageType = 'raw',
  status = 'pending',
}) {
  try {
    const db = await getDB();

    // Validate that total weightage doesn't exceed 100%
    const currentTotal = await getAssessmentWeightageTotal(subjectId);
    if (currentTotal + weightage > 100) {
      throw new Error(
        `Adding ${weightage}% weightage would exceed 100%. Current total: ${currentTotal}%, remaining: ${100 - currentTotal}%`
      );
    }

    const now = new Date().toISOString();
    const assessment = {
      id: crypto.randomUUID(),
      subjectId,
      semesterId,
      name,
      rawMaximum,
      weightage,
      marksScored,
      classAverage,
      classAverageType,
      status,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('assessments', assessment);
    return assessment;
  } catch (error) {
    console.error('Failed to create assessment:', error);
    throw error;
  }
}

/**
 * Update an assessment with partial data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} The updated assessment
 */
export async function updateAssessment(id, updates) {
  try {
    const db = await getDB();
    const assessment = await db.get('assessments', id);
    if (!assessment) {
      throw new Error(`Assessment with id ${id} not found`);
    }

    // If weightage is being updated, validate the new total
    if (updates.weightage !== undefined && updates.weightage !== assessment.weightage) {
      const currentTotal = await getAssessmentWeightageTotal(assessment.subjectId);
      const newTotal = currentTotal - assessment.weightage + updates.weightage;
      if (newTotal > 100) {
        throw new Error(
          `Updating to ${updates.weightage}% weightage would exceed 100%. Current total without this assessment: ${currentTotal - assessment.weightage}%`
        );
      }
    }

    const updatedAssessment = {
      ...assessment,
      ...updates,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    await db.put('assessments', updatedAssessment);
    return updatedAssessment;
  } catch (error) {
    console.error('Failed to update assessment:', error);
    throw error;
  }
}

/**
 * Delete an assessment.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteAssessment(id) {
  try {
    const db = await getDB();
    await db.delete('assessments', id);
  } catch (error) {
    console.error('Failed to delete assessment:', error);
    throw error;
  }
}

/**
 * Bulk create multiple assessments at once.
 * @param {Array} assessments - Array of assessment data objects
 * @returns {Promise<Array>} Array of created assessments
 */
export async function bulkCreateAssessments(assessments) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const createdAssessments = [];

    // Group assessments by subjectId to validate weightage per subject
    const subjectWeightageMap = new Map();

    // First, get current totals for all affected subjects
    for (const data of assessments) {
      if (!subjectWeightageMap.has(data.subjectId)) {
        const currentTotal = await getAssessmentWeightageTotal(data.subjectId);
        subjectWeightageMap.set(data.subjectId, currentTotal);
      }
    }

    // Validate all weightages before creating any
    for (const data of assessments) {
      const currentTotal = subjectWeightageMap.get(data.subjectId);
      const newWeightage = data.weightage || 0;
      if (currentTotal + newWeightage > 100) {
        throw new Error(
          `Adding ${newWeightage}% weightage for subject ${data.subjectId} would exceed 100%. Current total: ${currentTotal}%`
        );
      }
      subjectWeightageMap.set(data.subjectId, currentTotal + newWeightage);
    }

    // Create all assessments in a single transaction
    const tx = db.transaction('assessments', 'readwrite');
    for (const data of assessments) {
      const assessment = {
        id: crypto.randomUUID(),
        subjectId: data.subjectId,
        semesterId: data.semesterId,
        name: data.name,
        rawMaximum: data.rawMaximum,
        weightage: data.weightage,
        marksScored: data.marksScored ?? null,
        classAverage: data.classAverage ?? null,
        classAverageType: data.classAverageType || 'raw',
        status: data.status || 'pending',
        createdAt: now,
        updatedAt: now,
      };
      await tx.store.add(assessment);
      createdAssessments.push(assessment);
    }
    await tx.done;

    return createdAssessments;
  } catch (error) {
    console.error('Failed to bulk create assessments:', error);
    throw error;
  }
}
