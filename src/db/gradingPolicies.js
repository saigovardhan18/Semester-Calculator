import { getDB } from './database';

/**
 * Default absolute grading boundaries.
 */
export const DEFAULT_ABSOLUTE_BOUNDARIES = [
  { grade: 'O', minScore: 91, gradePoints: 10 },
  { grade: 'A+', minScore: 81, gradePoints: 9 },
  { grade: 'A', minScore: 71, gradePoints: 8 },
  { grade: 'B+', minScore: 61, gradePoints: 7 },
  { grade: 'B', minScore: 51, gradePoints: 6 },
  { grade: 'C', minScore: 41, gradePoints: 5 },
  { grade: 'P', minScore: 30, gradePoints: 4 },
  { grade: 'F', minScore: 0, gradePoints: 0 },
];

/**
 * Default relative grading bands (mean + σ based).
 */
export const DEFAULT_RELATIVE_BANDS = [
  { grade: 'O', formula: 'mean + 1.5σ', gradePoints: 10 },
  { grade: 'A+', formula: 'mean + 1.0σ', gradePoints: 9 },
  { grade: 'A', formula: 'mean + 0.5σ', gradePoints: 8 },
  { grade: 'B+', formula: 'mean', gradePoints: 7 },
  { grade: 'B', formula: 'mean - 0.5σ', gradePoints: 6 },
  { grade: 'C', formula: 'mean - 1.0σ', gradePoints: 5 },
  { grade: 'P', formula: 'mean - 1.5σ', gradePoints: 4 },
  { grade: 'F', formula: 'below P', gradePoints: 0 },
];

/**
 * Default grade scale mapping grade to grade points.
 */
export const DEFAULT_GRADE_SCALE = [
  { grade: 'O', gradePoints: 10 },
  { grade: 'A+', gradePoints: 9 },
  { grade: 'A', gradePoints: 8 },
  { grade: 'B+', gradePoints: 7 },
  { grade: 'B', gradePoints: 6 },
  { grade: 'C', gradePoints: 5 },
  { grade: 'P', gradePoints: 4 },
  { grade: 'F', gradePoints: 0 },
];

/**
 * Get the default grading policy (not stored in DB).
 * @returns {Object}
 */
export function getDefaultGradingPolicy() {
  return {
    method: 'absolute',
    absoluteBoundaries: [...DEFAULT_ABSOLUTE_BOUNDARIES],
    relativeBands: [...DEFAULT_RELATIVE_BANDS],
    manualCutoffs: [],
    gradeScale: [...DEFAULT_GRADE_SCALE],
  };
}

/**
 * Get the grading policy for a specific subject.
 * @param {string} subjectId
 * @returns {Promise<Object|null>} The grading policy, or null if none exists
 */
export async function getGradingPolicy(subjectId) {
  try {
    const db = await getDB();
    const policies = await db.getAllFromIndex('gradingPolicies', 'subjectId', subjectId);
    return policies[0] || null;
  } catch (error) {
    console.error('Failed to get grading policy:', error);
    throw error;
  }
}

/**
 * Create or update a grading policy for a subject.
 * @param {{ subjectId: string, semesterId: string, method: 'absolute'|'relative', absoluteBoundaries?: Array, relativeBands?: Array, manualCutoffs?: Array, gradeScale?: Array }} data
 * @returns {Promise<Object>} The created/updated grading policy
 */
export async function createOrUpdateGradingPolicy({
  subjectId,
  semesterId,
  method,
  absoluteBoundaries,
  relativeBands,
  manualCutoffs,
  gradeScale,
}) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();

    // Check if a policy already exists for this subject
    const existingPolicies = await db.getAllFromIndex('gradingPolicies', 'subjectId', subjectId);
    const existing = existingPolicies[0];

    const defaults = getDefaultGradingPolicy();

    const policy = {
      id: existing ? existing.id : crypto.randomUUID(),
      subjectId,
      semesterId,
      method: method || defaults.method,
      absoluteBoundaries: absoluteBoundaries || existing?.absoluteBoundaries || defaults.absoluteBoundaries,
      relativeBands: relativeBands || existing?.relativeBands || defaults.relativeBands,
      manualCutoffs: manualCutoffs || existing?.manualCutoffs || defaults.manualCutoffs,
      gradeScale: gradeScale || existing?.gradeScale || defaults.gradeScale,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    await db.put('gradingPolicies', policy);
    return policy;
  } catch (error) {
    console.error('Failed to create/update grading policy:', error);
    throw error;
  }
}

/**
 * Delete a grading policy.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteGradingPolicy(id) {
  try {
    const db = await getDB();
    await db.delete('gradingPolicies', id);
  } catch (error) {
    console.error('Failed to delete grading policy:', error);
    throw error;
  }
}
