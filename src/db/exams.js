import { getDB } from './database';

/**
 * Get all exams.
 * @returns {Promise<Array>}
 */
export async function getAllExams() {
  try {
    const db = await getDB();
    return await db.getAll('exams');
  } catch (error) {
    console.error('Failed to get all exams:', error);
    throw error;
  }
}

/**
 * Get all exams for a semester.
 * @param {string} semesterId
 * @returns {Promise<Array>}
 */
export async function getExamsBySemester(semesterId) {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('exams', 'semesterId', semesterId);
  } catch (error) {
    console.error('Failed to get exams by semester:', error);
    throw error;
  }
}

/**
 * Get all exams for a subject.
 * @param {string} subjectId
 * @returns {Promise<Array>}
 */
export async function getExamsBySubject(subjectId) {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('exams', 'subjectId', subjectId);
  } catch (error) {
    console.error('Failed to get exams by subject:', error);
    throw error;
  }
}

/**
 * Get upcoming exams (date >= today), sorted by date ascending.
 * @returns {Promise<Array>}
 */
export async function getUpcomingExams() {
  try {
    const db = await getDB();
    const allExams = await db.getAll('exams');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];

    return allExams
      .filter((exam) => exam.date >= todayISO && !exam.isCompleted)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Failed to get upcoming exams:', error);
    throw error;
  }
}

/**
 * Create a new exam.
 * @param {{ title: string, semesterId: string, subjectId: string, type: string, date: string, startTime: string, endTime: string|null, venue: string, syllabus: string, notes: string, targetMarks: number|null }} data
 * @returns {Promise<Object>} The created exam
 */
export async function createExam({
  title,
  semesterId,
  subjectId,
  type,
  date,
  startTime,
  endTime = null,
  venue = '',
  syllabus = '',
  notes = '',
  targetMarks = null,
}) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const exam = {
      id: crypto.randomUUID(),
      title,
      semesterId,
      subjectId,
      type,
      date,
      startTime,
      endTime,
      venue,
      syllabus,
      notes,
      targetMarks,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('exams', exam);
    return exam;
  } catch (error) {
    console.error('Failed to create exam:', error);
    throw error;
  }
}

/**
 * Update an exam with partial data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} The updated exam
 */
export async function updateExam(id, updates) {
  try {
    const db = await getDB();
    const exam = await db.get('exams', id);
    if (!exam) {
      throw new Error(`Exam with id ${id} not found`);
    }

    const updatedExam = {
      ...exam,
      ...updates,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    await db.put('exams', updatedExam);
    return updatedExam;
  } catch (error) {
    console.error('Failed to update exam:', error);
    throw error;
  }
}

/**
 * Delete an exam.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteExam(id) {
  try {
    const db = await getDB();
    await db.delete('exams', id);
  } catch (error) {
    console.error('Failed to delete exam:', error);
    throw error;
  }
}
