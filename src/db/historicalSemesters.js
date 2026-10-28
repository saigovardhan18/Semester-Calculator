import { getDB } from './database';

/**
 * Get all historical semesters.
 * @returns {Promise<Array>}
 */
export async function getAllHistoricalSemesters() {
  try {
    const db = await getDB();
    return await db.getAll('historicalSemesters');
  } catch (error) {
    console.error('Failed to get all historical semesters:', error);
    throw error;
  }
}

/**
 * Create a new historical semester.
 * @param {{ name: string, year: string, sgpa: number, totalCredits: number }} data
 * @returns {Promise<Object>} The created historical semester
 */
export async function createHistoricalSemester({ name, year, sgpa, totalCredits }) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();
    const historicalSemester = {
      id: crypto.randomUUID(),
      name,
      year,
      sgpa,
      totalCredits,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('historicalSemesters', historicalSemester);
    return historicalSemester;
  } catch (error) {
    console.error('Failed to create historical semester:', error);
    throw error;
  }
}

/**
 * Update a historical semester with partial data.
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>} The updated historical semester
 */
export async function updateHistoricalSemester(id, updates) {
  try {
    const db = await getDB();
    const historicalSemester = await db.get('historicalSemesters', id);
    if (!historicalSemester) {
      throw new Error(`Historical semester with id ${id} not found`);
    }

    const updatedHistoricalSemester = {
      ...historicalSemester,
      ...updates,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    await db.put('historicalSemesters', updatedHistoricalSemester);
    return updatedHistoricalSemester;
  } catch (error) {
    console.error('Failed to update historical semester:', error);
    throw error;
  }
}

/**
 * Delete a historical semester.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteHistoricalSemester(id) {
  try {
    const db = await getDB();
    await db.delete('historicalSemesters', id);
  } catch (error) {
    console.error('Failed to delete historical semester:', error);
    throw error;
  }
}
