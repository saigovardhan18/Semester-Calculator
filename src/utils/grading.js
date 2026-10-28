/**
 * Grading system utilities
 * Provides grade scales, boundaries, and grade calculation functions.
 */

import { roundToDecimal } from './calculations';

/**
 * Default grade scale (grade label → grade points mapping)
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
 * Default absolute grading boundaries (score thresholds).
 * A student scoring >= minScore gets the corresponding grade.
 * Sorted descending by minScore for lookup.
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
 * Default relative grading bands (mean + σ).
 * sigmaOffset defines the number of standard deviations above the mean.
 * null sigmaOffset represents the fail band (everything below the lowest defined band).
 */
export const DEFAULT_RELATIVE_BANDS = [
  { grade: 'O', sigmaOffset: 1.5, gradePoints: 10 },
  { grade: 'A+', sigmaOffset: 1.0, gradePoints: 9 },
  { grade: 'A', sigmaOffset: 0.5, gradePoints: 8 },
  { grade: 'B+', sigmaOffset: 0.0, gradePoints: 7 },
  { grade: 'B', sigmaOffset: -0.5, gradePoints: 6 },
  { grade: 'C', sigmaOffset: -1.0, gradePoints: 5 },
  { grade: 'P', sigmaOffset: -1.5, gradePoints: 4 },
  { grade: 'F', sigmaOffset: null, gradePoints: 0 },
];

/**
 * Get grade from absolute boundaries.
 * @param {number} score - student's score (0–100 weighted scale)
 * @param {Array<{ grade: string, minScore: number, gradePoints: number }>} boundaries
 * @returns {{ grade: string, gradePoints: number } | null}
 */
export function getAbsoluteGrade(score, boundaries = DEFAULT_ABSOLUTE_BOUNDARIES) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  if (!Array.isArray(boundaries) || boundaries.length === 0) return null;

  // Sort descending by minScore to find the first match
  const sorted = [...boundaries].sort((a, b) => b.minScore - a.minScore);

  for (const boundary of sorted) {
    if (score >= boundary.minScore) {
      return { grade: boundary.grade, gradePoints: boundary.gradePoints };
    }
  }

  // Below the lowest boundary — return the last entry (usually F)
  const lowest = sorted[sorted.length - 1];
  return { grade: lowest.grade, gradePoints: lowest.gradePoints };
}

/**
 * Get grade from relative grading using mean and standard deviation.
 * @param {number} score - student's score
 * @param {number} mean - class mean
 * @param {number} stdDev - class standard deviation
 * @param {Array} bands - relative grading bands (default: DEFAULT_RELATIVE_BANDS)
 * @returns {{ grade: string, gradePoints: number } | null}
 */
export function getRelativeGrade(score, mean, stdDev, bands = DEFAULT_RELATIVE_BANDS) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  if (typeof mean !== 'number' || Number.isNaN(mean)) return null;
  if (typeof stdDev !== 'number' || Number.isNaN(stdDev) || stdDev <= 0) return null;
  if (!Array.isArray(bands) || bands.length === 0) return null;

  // Sort bands descending by sigmaOffset (nulls at end)
  const sorted = [...bands].sort((a, b) => {
    if (a.sigmaOffset === null) return 1;
    if (b.sigmaOffset === null) return -1;
    return b.sigmaOffset - a.sigmaOffset;
  });

  for (const band of sorted) {
    if (band.sigmaOffset === null) continue;
    const threshold = mean + band.sigmaOffset * stdDev;
    if (score >= threshold) {
      return { grade: band.grade, gradePoints: band.gradePoints };
    }
  }

  // Fell below all non-null bands → assign the fail band
  const failBand = sorted.find((b) => b.sigmaOffset === null);
  if (failBand) {
    return { grade: failBand.grade, gradePoints: failBand.gradePoints };
  }

  // No fail band defined — return the lowest band
  const lowestBand = sorted[sorted.length - 1];
  return { grade: lowestBand.grade, gradePoints: lowestBand.gradePoints };
}

/**
 * Get grade from manual cutoffs.
 * Manual cutoffs have the same shape as absolute boundaries but are user-defined per subject.
 * @param {number} score
 * @param {Array<{ grade: string, minScore: number, gradePoints: number }>} cutoffs
 * @returns {{ grade: string, gradePoints: number } | null}
 */
export function getManualCutoffGrade(score, cutoffs) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  if (!Array.isArray(cutoffs) || cutoffs.length === 0) return null;

  const sorted = [...cutoffs].sort((a, b) => b.minScore - a.minScore);

  for (const cutoff of sorted) {
    if (score >= cutoff.minScore) {
      return { grade: cutoff.grade, gradePoints: cutoff.gradePoints };
    }
  }

  const lowest = sorted[sorted.length - 1];
  return { grade: lowest.grade, gradePoints: lowest.gradePoints };
}

/**
 * Calculate relative grading boundaries from mean and stdDev.
 * Converts sigma bands into concrete score thresholds.
 * @param {number} mean
 * @param {number} stdDev
 * @param {Array} bands - relative grading bands
 * @returns {Array<{ grade: string, minScore: number, gradePoints: number }>}
 */
export function calculateRelativeBoundaries(mean, stdDev, bands = DEFAULT_RELATIVE_BANDS) {
  if (typeof mean !== 'number' || typeof stdDev !== 'number' || stdDev <= 0) return [];
  if (!Array.isArray(bands) || bands.length === 0) return [];

  return bands
    .filter((band) => band.sigmaOffset !== null)
    .map((band) => ({
      grade: band.grade,
      minScore: roundToDecimal(mean + band.sigmaOffset * stdDev),
      gradePoints: band.gradePoints,
    }))
    .sort((a, b) => b.minScore - a.minScore)
    .concat(
      // Add fail band at the bottom with minScore = 0
      bands
        .filter((band) => band.sigmaOffset === null)
        .map((band) => ({
          grade: band.grade,
          minScore: 0,
          gradePoints: band.gradePoints,
        }))
    );
}

/**
 * Get the minimum score needed for a target grade.
 * @param {string} targetGrade - e.g., 'O', 'A+', 'A'
 * @param {object} gradingPolicy - { type: 'absolute'|'relative'|'manual', boundaries?, mean?, stdDev?, bands?, cutoffs? }
 * @returns {number|null} minimum score needed, or null if not determinable
 */
export function getMinScoreForGrade(targetGrade, gradingPolicy) {
  if (!targetGrade || !gradingPolicy) return null;

  const { type } = gradingPolicy;

  if (type === 'absolute') {
    const boundaries = gradingPolicy.boundaries || DEFAULT_ABSOLUTE_BOUNDARIES;
    const boundary = boundaries.find((b) => b.grade === targetGrade);
    return boundary ? boundary.minScore : null;
  }

  if (type === 'relative') {
    const { mean, stdDev, bands: customBands } = gradingPolicy;
    const bands = customBands || DEFAULT_RELATIVE_BANDS;

    if (typeof mean !== 'number' || typeof stdDev !== 'number' || stdDev <= 0) return null;

    const band = bands.find((b) => b.grade === targetGrade);
    if (!band || band.sigmaOffset === null) return null;

    return roundToDecimal(mean + band.sigmaOffset * stdDev);
  }

  if (type === 'manual') {
    const cutoffs = gradingPolicy.cutoffs || [];
    const cutoff = cutoffs.find((c) => c.grade === targetGrade);
    return cutoff ? cutoff.minScore : null;
  }

  return null;
}

/**
 * Get grade points for a grade label from a grade scale.
 * @param {string} grade - e.g., 'O', 'A+', 'F'
 * @param {Array<{ grade: string, gradePoints: number }>} gradeScale
 * @returns {number|null} grade points, or null if not found
 */
export function getGradePoints(grade, gradeScale = DEFAULT_GRADE_SCALE) {
  if (!grade || !Array.isArray(gradeScale)) return null;

  const entry = gradeScale.find((g) => g.grade === grade);
  return entry ? entry.gradePoints : null;
}
