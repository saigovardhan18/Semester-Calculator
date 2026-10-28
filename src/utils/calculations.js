/**
 * Academic calculation utilities
 * All functions are pure — no side effects, no mutations.
 */

/**
 * Round to specified decimal places, handling floating-point precision.
 * Uses the "exponential notation" trick to avoid IEEE 754 rounding errors.
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function roundToDecimal(value, decimals = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  if (!Number.isFinite(value)) return 0;
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
 * Calculate percentage.
 * @param {number} scored
 * @param {number} maximum
 * @returns {number} percentage (0–100), or 0 if maximum is invalid
 */
export function calculatePercentage(scored, maximum) {
  if (typeof scored !== 'number' || typeof maximum !== 'number') return 0;
  if (maximum <= 0) return 0;
  return roundToDecimal((scored / maximum) * 100);
}

/**
 * Calculate weighted marks for an assessment.
 * Formula: (scored / maximum) * weightage
 * @param {number|null|undefined} scored - marks scored
 * @param {number} maximum - maximum possible marks
 * @param {number} weightage - weightage of the assessment
 * @returns {number|null} weighted marks or null if scored is null/undefined
 */
export function calculateWeightedMarks(scored, maximum, weightage) {
  if (scored === null || scored === undefined) return null;
  if (typeof scored !== 'number' || Number.isNaN(scored)) return null;
  if (typeof maximum !== 'number' || maximum <= 0) return null;
  if (typeof weightage !== 'number' || weightage < 0) return null;
  return roundToDecimal((scored / maximum) * weightage);
}

/**
 * Calculate weighted class average for an assessment.
 * If classAverageType is 'raw', convert: (classAverage / maximum) * weightage
 * If classAverageType is 'weighted', return as-is (already weighted)
 * @param {number|null|undefined} classAverage
 * @param {'raw'|'weighted'} classAverageType
 * @param {number} maximum
 * @param {number} weightage
 * @returns {number|null}
 */
export function calculateWeightedClassAverage(classAverage, classAverageType, maximum, weightage) {
  if (classAverage === null || classAverage === undefined) return null;
  if (typeof classAverage !== 'number' || Number.isNaN(classAverage)) return null;
  if (classAverageType === 'weighted') return roundToDecimal(classAverage);
  // Default to 'raw' conversion
  if (typeof maximum !== 'number' || maximum <= 0) return null;
  if (typeof weightage !== 'number' || weightage < 0) return null;
  return roundToDecimal((classAverage / maximum) * weightage);
}

/**
 * Calculate total weighted marks from completed assessments.
 * Only includes assessments where status === 'completed' and marksScored is not null.
 * @param {Array} assessments
 * @returns {{ totalWeighted: number, completedWeightage: number, totalMaxWeightage: number }}
 */
export function calculateSubjectProgress(assessments) {
  const result = {
    totalWeighted: 0,
    completedWeightage: 0,
    totalMaxWeightage: 0,
  };

  if (!Array.isArray(assessments) || assessments.length === 0) return result;

  for (const assessment of assessments) {
    const weightage = typeof assessment.weightage === 'number' ? assessment.weightage : 0;
    result.totalMaxWeightage += weightage;

    if (assessment.status === 'completed' && assessment.marksScored !== null && assessment.marksScored !== undefined) {
      const weighted = calculateWeightedMarks(
        assessment.marksScored,
        assessment.maximumMarks,
        weightage
      );
      if (weighted !== null) {
        result.totalWeighted = roundToDecimal(result.totalWeighted + weighted);
        result.completedWeightage += weightage;
      }
    }
  }

  result.totalWeighted = roundToDecimal(result.totalWeighted);
  result.completedWeightage = roundToDecimal(result.completedWeightage);
  result.totalMaxWeightage = roundToDecimal(result.totalMaxWeightage);

  return result;
}

/**
 * Calculate class average total from completed assessments.
 * Only includes assessments where both marksScored and classAverage exist.
 * @param {Array} assessments
 * @returns {{ classWeightedTotal: number, comparableWeightage: number }}
 */
export function calculateClassAverageTotal(assessments) {
  const result = {
    classWeightedTotal: 0,
    comparableWeightage: 0,
  };

  if (!Array.isArray(assessments) || assessments.length === 0) return result;

  for (const assessment of assessments) {
    // Only include if both student marks and class average are present
    if (
      assessment.status === 'completed' &&
      assessment.marksScored !== null &&
      assessment.marksScored !== undefined &&
      assessment.classAverage !== null &&
      assessment.classAverage !== undefined
    ) {
      const weightedClassAvg = calculateWeightedClassAverage(
        assessment.classAverage,
        assessment.classAverageType || 'raw',
        assessment.maximumMarks,
        assessment.weightage
      );

      if (weightedClassAvg !== null) {
        result.classWeightedTotal = roundToDecimal(result.classWeightedTotal + weightedClassAvg);
        result.comparableWeightage += assessment.weightage;
      }
    }
  }

  result.classWeightedTotal = roundToDecimal(result.classWeightedTotal);
  result.comparableWeightage = roundToDecimal(result.comparableWeightage);

  return result;
}

/**
 * Calculate the difference between student and class average.
 * Only compare assessments where both values exist.
 * @param {Array} assessments
 * @returns {{ difference: number, studentTotal: number, classTotal: number, comparableWeightage: number }}
 */
export function calculateDifferenceFromClassAverage(assessments) {
  const result = {
    difference: 0,
    studentTotal: 0,
    classTotal: 0,
    comparableWeightage: 0,
  };

  if (!Array.isArray(assessments) || assessments.length === 0) return result;

  for (const assessment of assessments) {
    if (
      assessment.status === 'completed' &&
      assessment.marksScored !== null &&
      assessment.marksScored !== undefined &&
      assessment.classAverage !== null &&
      assessment.classAverage !== undefined
    ) {
      const studentWeighted = calculateWeightedMarks(
        assessment.marksScored,
        assessment.maximumMarks,
        assessment.weightage
      );
      const classWeighted = calculateWeightedClassAverage(
        assessment.classAverage,
        assessment.classAverageType || 'raw',
        assessment.maximumMarks,
        assessment.weightage
      );

      if (studentWeighted !== null && classWeighted !== null) {
        result.studentTotal = roundToDecimal(result.studentTotal + studentWeighted);
        result.classTotal = roundToDecimal(result.classTotal + classWeighted);
        result.comparableWeightage += assessment.weightage;
      }
    }
  }

  result.difference = roundToDecimal(result.studentTotal - result.classTotal);
  result.comparableWeightage = roundToDecimal(result.comparableWeightage);

  return result;
}

/**
 * Calculate minimum required marks in remaining assessments to achieve a target.
 * @param {number} currentWeightedTotal - current weighted marks
 * @param {number} completedWeightage - sum of completed assessment weightages
 * @param {number} targetTotal - target weighted total (e.g., 91 for O grade)
 * @param {number} remainingWeightage - sum of remaining assessment weightages
 * @param {number|null} endSemRawMaximum - raw maximum for end-semester exam (optional)
 * @param {number|null} endSemWeightage - weightage of end-semester exam (optional)
 * @returns {{ requiredWeightedMarks: number, requiredRawMarks: number|null, isAchievable: boolean, isAlreadyAchieved: boolean, maxPossibleTotal: number }}
 */
export function calculateRequiredMarks(
  currentWeightedTotal,
  completedWeightage,
  targetTotal,
  remainingWeightage,
  endSemRawMaximum = null,
  endSemWeightage = null
) {
  const safeCurrentTotal = typeof currentWeightedTotal === 'number' ? currentWeightedTotal : 0;
  const safeTarget = typeof targetTotal === 'number' ? targetTotal : 0;
  const safeRemaining = typeof remainingWeightage === 'number' ? remainingWeightage : 0;

  const maxPossibleTotal = roundToDecimal(safeCurrentTotal + safeRemaining);
  const requiredWeightedMarks = safeTarget - safeCurrentTotal;

  const isAlreadyAchieved = requiredWeightedMarks <= 0;
  const isAchievable = requiredWeightedMarks <= safeRemaining;

  let requiredRawMarks = null;
  if (
    endSemRawMaximum &&
    typeof endSemRawMaximum === 'number' &&
    endSemRawMaximum > 0 &&
    endSemWeightage &&
    typeof endSemWeightage === 'number' &&
    endSemWeightage > 0
  ) {
    // Convert required weighted marks to raw marks for the end-semester exam
    requiredRawMarks = (requiredWeightedMarks / endSemWeightage) * endSemRawMaximum;
    // Clamp to valid range
    if (requiredRawMarks < 0) requiredRawMarks = 0;
    requiredRawMarks = roundToDecimal(requiredRawMarks);
  }

  return {
    requiredWeightedMarks: roundToDecimal(Math.max(0, requiredWeightedMarks)),
    requiredRawMarks,
    isAchievable,
    isAlreadyAchieved,
    maxPossibleTotal,
  };
}

/**
 * Predict grade based on score and grading policy.
 * For absolute: compare score against boundaries.
 * For relative: if we have mean and stdDev, calculate boundaries from bands.
 * For manual: use manual cutoffs.
 * @param {number} score - the student's total weighted score (0–100 scale)
 * @param {object} gradingPolicy - { type: 'absolute'|'relative'|'manual', boundaries?, mean?, stdDev?, bands?, cutoffs?, gradeScale? }
 * @returns {{ grade: string, gradePoints: number, confidence: 'confirmed'|'estimated'|'insufficient' }}
 */
export function predictGrade(score, gradingPolicy) {
  const fallback = { grade: 'N/A', gradePoints: 0, confidence: 'insufficient' };

  if (typeof score !== 'number' || Number.isNaN(score)) return fallback;
  if (!gradingPolicy || typeof gradingPolicy !== 'object') return fallback;

  const { type } = gradingPolicy;

  if (type === 'absolute') {
    const boundaries = gradingPolicy.boundaries || [];
    if (boundaries.length === 0) return fallback;

    // Boundaries should be sorted descending by minScore
    const sorted = [...boundaries].sort((a, b) => b.minScore - a.minScore);
    for (const boundary of sorted) {
      if (score >= boundary.minScore) {
        return {
          grade: boundary.grade,
          gradePoints: boundary.gradePoints,
          confidence: 'confirmed',
        };
      }
    }
    // Below the lowest boundary
    const lowest = sorted[sorted.length - 1];
    return {
      grade: lowest.grade,
      gradePoints: lowest.gradePoints,
      confidence: 'confirmed',
    };
  }

  if (type === 'relative') {
    const { mean, stdDev, bands } = gradingPolicy;

    if (
      typeof mean !== 'number' ||
      typeof stdDev !== 'number' ||
      !Array.isArray(bands) ||
      bands.length === 0
    ) {
      return { ...fallback, confidence: 'insufficient' };
    }

    if (stdDev <= 0) {
      // If stdDev is zero, all students have the same score
      // Grade based on the midpoint band
      return { ...fallback, confidence: 'insufficient' };
    }

    // Calculate boundaries from mean and stdDev
    // Bands sorted descending by sigmaOffset
    const sortedBands = [...bands].sort((a, b) => {
      if (a.sigmaOffset === null) return 1;
      if (b.sigmaOffset === null) return -1;
      return b.sigmaOffset - a.sigmaOffset;
    });

    for (const band of sortedBands) {
      if (band.sigmaOffset === null) continue; // This is the fail grade
      const minScore = roundToDecimal(mean + band.sigmaOffset * stdDev);
      if (score >= minScore) {
        return {
          grade: band.grade,
          gradePoints: band.gradePoints,
          confidence: 'estimated',
        };
      }
    }

    // Fell below all bands — assign the fail grade (sigmaOffset === null)
    const failBand = sortedBands.find((b) => b.sigmaOffset === null);
    if (failBand) {
      return {
        grade: failBand.grade,
        gradePoints: failBand.gradePoints,
        confidence: 'estimated',
      };
    }

    // No fail band defined — use the lowest band
    const lowestBand = sortedBands[sortedBands.length - 1];
    return {
      grade: lowestBand.grade,
      gradePoints: lowestBand.gradePoints,
      confidence: 'estimated',
    };
  }

  if (type === 'manual') {
    const cutoffs = gradingPolicy.cutoffs || [];
    if (cutoffs.length === 0) return fallback;

    // cutoffs should have { grade, minScore, gradePoints }
    const sorted = [...cutoffs].sort((a, b) => b.minScore - a.minScore);
    for (const cutoff of sorted) {
      if (score >= cutoff.minScore) {
        return {
          grade: cutoff.grade,
          gradePoints: cutoff.gradePoints,
          confidence: 'confirmed',
        };
      }
    }
    const lowest = sorted[sorted.length - 1];
    return {
      grade: lowest.grade,
      gradePoints: lowest.gradePoints,
      confidence: 'confirmed',
    };
  }

  return fallback;
}

/**
 * Calculate SGPA from subjects with grades.
 * SGPA = Σ(credits × gradePoints) / Σ(credits)
 * Only includes subjects with assigned gradePoints.
 * @param {Array<{ credits: number, gradePoints: number|null }>} subjects
 * @returns {{ sgpa: number|null, totalCredits: number, gradedCredits: number, isEstimated: boolean }}
 */
export function calculateSGPA(subjects) {
  const result = {
    sgpa: null,
    totalCredits: 0,
    gradedCredits: 0,
    isEstimated: false,
  };

  if (!Array.isArray(subjects) || subjects.length === 0) return result;

  let weightedSum = 0;

  for (const subject of subjects) {
    const credits = typeof subject.credits === 'number' ? subject.credits : 0;
    result.totalCredits += credits;

    if (subject.gradePoints !== null && subject.gradePoints !== undefined && typeof subject.gradePoints === 'number') {
      weightedSum += credits * subject.gradePoints;
      result.gradedCredits += credits;

      // If any subject's grade is estimated, mark the whole SGPA as estimated
      if (subject.isEstimated) {
        result.isEstimated = true;
      }
    }
  }

  if (result.gradedCredits > 0) {
    result.sgpa = roundToDecimal(weightedSum / result.gradedCredits);
  }

  return result;
}

/**
 * Calculate CGPA from all semester data.
 * CGPA = Σ(all credits × sgpa) / Σ(all credits)
 * Note: True CGPA should use individual subject grade points, but this approximation
 * works when we have semester-level data with totalCredits being the graded credits.
 * @param {Array<{ sgpa: number, totalCredits: number, isEstimated: boolean }>} semesters
 * @returns {{ cgpa: number|null, totalCredits: number, isEstimated: boolean }}
 */
export function calculateCGPA(semesters) {
  const result = {
    cgpa: null,
    totalCredits: 0,
    isEstimated: false,
  };

  if (!Array.isArray(semesters) || semesters.length === 0) return result;

  let weightedSum = 0;
  let totalCredits = 0;

  for (const semester of semesters) {
    if (
      typeof semester.sgpa === 'number' &&
      !Number.isNaN(semester.sgpa) &&
      typeof semester.totalCredits === 'number' &&
      semester.totalCredits > 0
    ) {
      weightedSum += semester.sgpa * semester.totalCredits;
      totalCredits += semester.totalCredits;

      if (semester.isEstimated) {
        result.isEstimated = true;
      }
    }
  }

  if (totalCredits > 0) {
    result.cgpa = roundToDecimal(weightedSum / totalCredits);
    result.totalCredits = totalCredits;
  }

  return result;
}

/**
 * Perform what-if simulation.
 * Takes current assessments and hypothetical changes, returns predicted outcome.
 * @param {Array} assessments - the current assessments array
 * @param {Object} hypotheticalChanges - map of assessmentId → hypothetical marksScored
 * @param {object} gradingPolicy - grading policy for grade prediction
 * @returns {{ predictedTotal: number, completedWeightage: number, totalMaxWeightage: number, predictedGrade: object }}
 */
export function simulateScenario(assessments, hypotheticalChanges, gradingPolicy) {
  const result = {
    predictedTotal: 0,
    completedWeightage: 0,
    totalMaxWeightage: 0,
    predictedGrade: { grade: 'N/A', gradePoints: 0, confidence: 'insufficient' },
  };

  if (!Array.isArray(assessments) || assessments.length === 0) return result;

  const changes = hypotheticalChanges || {};

  for (const assessment of assessments) {
    const weightage = typeof assessment.weightage === 'number' ? assessment.weightage : 0;
    result.totalMaxWeightage += weightage;

    // Check if there's a hypothetical override for this assessment
    const hypotheticalScore = changes[assessment.id];

    let marksToUse = null;

    if (hypotheticalScore !== null && hypotheticalScore !== undefined && typeof hypotheticalScore === 'number') {
      // Use the hypothetical score
      marksToUse = hypotheticalScore;
    } else if (assessment.status === 'completed' && assessment.marksScored !== null && assessment.marksScored !== undefined) {
      // Use actual score
      marksToUse = assessment.marksScored;
    }

    if (marksToUse !== null) {
      const weighted = calculateWeightedMarks(marksToUse, assessment.maximumMarks, weightage);
      if (weighted !== null) {
        result.predictedTotal = roundToDecimal(result.predictedTotal + weighted);
        result.completedWeightage += weightage;
      }
    }
  }

  result.predictedTotal = roundToDecimal(result.predictedTotal);
  result.completedWeightage = roundToDecimal(result.completedWeightage);
  result.totalMaxWeightage = roundToDecimal(result.totalMaxWeightage);

  // Predict the grade based on the simulated total
  if (gradingPolicy) {
    result.predictedGrade = predictGrade(result.predictedTotal, gradingPolicy);
    // Override confidence to 'estimated' since this is a simulation
    if (result.predictedGrade.confidence === 'confirmed') {
      result.predictedGrade.confidence = 'estimated';
    }
  }

  return result;
}
