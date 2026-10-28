/**
 * Validation utilities
 * All validation functions return { valid: boolean, error: string|null }.
 */

/**
 * Validate marks input.
 * - Must be a number
 * - Must be >= 0
 * - Must be <= maximum
 * @param {*} value
 * @param {number} maximum
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateMarks(value, maximum) {
  if (value === null || value === undefined || value === '') {
    return { valid: true, error: null }; // Allow empty (marks not entered yet)
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Marks must be a valid number' };
  }

  if (num < 0) {
    return { valid: false, error: 'Marks cannot be negative' };
  }

  if (typeof maximum === 'number' && maximum > 0 && num > maximum) {
    return { valid: false, error: `Marks cannot exceed the maximum (${maximum})` };
  }

  return { valid: true, error: null };
}

/**
 * Validate credits.
 * - Must be a positive number
 * - Must be reasonable (1–20)
 * @param {*} value
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateCredits(value) {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'Credits are required' };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Credits must be a valid number' };
  }

  if (!Number.isInteger(num) && num % 0.5 !== 0) {
    return { valid: false, error: 'Credits must be a whole number or half credit (e.g., 1, 1.5, 2)' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Credits must be greater than 0' };
  }

  if (num > 20) {
    return { valid: false, error: 'Credits cannot exceed 20' };
  }

  return { valid: true, error: null };
}

/**
 * Validate that assessment weightages total to 100 (or close to it).
 * @param {Array<{ weightage: number }>} assessments
 * @returns {{ valid: boolean, error: string|null, total: number }}
 */
export function validateWeightageTotal(assessments) {
  if (!Array.isArray(assessments) || assessments.length === 0) {
    return { valid: true, error: null, total: 0 };
  }

  let total = 0;
  for (const assessment of assessments) {
    const w = typeof assessment.weightage === 'number' ? assessment.weightage : 0;
    if (w < 0) {
      return { valid: false, error: 'Weightage cannot be negative', total };
    }
    total += w;
  }

  // Allow small floating-point tolerance
  total = Math.round(total * 100) / 100;

  if (Math.abs(total - 100) > 0.01) {
    return {
      valid: false,
      error: `Assessment weightages must total 100. Current total: ${total}`,
      total,
    };
  }

  return { valid: true, error: null, total };
}

/**
 * Validate semester name.
 * @param {string} name
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateSemesterName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Semester name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Semester name cannot be empty' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Semester name is too long (max 100 characters)' };
  }

  return { valid: true, error: null };
}

/**
 * Validate subject data.
 * @param {{ name: string, credits: number, code?: string }} subject
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
export function validateSubject(subject) {
  const errors = {};

  if (!subject || typeof subject !== 'object') {
    return { valid: false, errors: { _form: 'Invalid subject data' } };
  }

  // Name validation
  if (!subject.name || typeof subject.name !== 'string' || subject.name.trim().length === 0) {
    errors.name = 'Subject name is required';
  } else if (subject.name.trim().length > 150) {
    errors.name = 'Subject name is too long (max 150 characters)';
  }

  // Credits validation
  const creditsResult = validateCredits(subject.credits);
  if (!creditsResult.valid) {
    errors.credits = creditsResult.error;
  }

  // Code validation (optional)
  if (subject.code !== undefined && subject.code !== null && subject.code !== '') {
    if (typeof subject.code !== 'string') {
      errors.code = 'Subject code must be a string';
    } else if (subject.code.trim().length > 20) {
      errors.code = 'Subject code is too long (max 20 characters)';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate exam data.
 * @param {{ subjectId: string, name: string, date: string, type?: string }} exam
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
export function validateExam(exam) {
  const errors = {};

  if (!exam || typeof exam !== 'object') {
    return { valid: false, errors: { _form: 'Invalid exam data' } };
  }

  // Subject ID
  if (!exam.subjectId || typeof exam.subjectId !== 'string' || exam.subjectId.trim().length === 0) {
    errors.subjectId = 'Subject is required';
  }

  // Name validation
  if (!exam.name || typeof exam.name !== 'string' || exam.name.trim().length === 0) {
    errors.name = 'Exam name is required';
  } else if (exam.name.trim().length > 150) {
    errors.name = 'Exam name is too long (max 150 characters)';
  }

  // Date validation
  if (!exam.date) {
    errors.date = 'Exam date is required';
  } else {
    const examDate = new Date(exam.date);
    if (isNaN(examDate.getTime())) {
      errors.date = 'Invalid exam date';
    }
  }

  // Type validation (optional)
  const validTypes = ['quiz', 'midterm', 'endterm', 'assignment', 'lab', 'project', 'other'];
  if (exam.type && !validTypes.includes(exam.type)) {
    errors.type = `Invalid exam type. Must be one of: ${validTypes.join(', ')}`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate grade scale.
 * @param {Array<{ grade: string, gradePoints: number }>} scale
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateGradeScale(scale) {
  if (!Array.isArray(scale) || scale.length === 0) {
    return { valid: false, error: 'Grade scale must have at least one entry' };
  }

  const gradeNames = new Set();

  for (let i = 0; i < scale.length; i++) {
    const entry = scale[i];

    if (!entry || typeof entry !== 'object') {
      return { valid: false, error: `Entry ${i + 1} is invalid` };
    }

    if (!entry.grade || typeof entry.grade !== 'string' || entry.grade.trim().length === 0) {
      return { valid: false, error: `Entry ${i + 1} must have a grade name` };
    }

    if (typeof entry.gradePoints !== 'number' || isNaN(entry.gradePoints)) {
      return { valid: false, error: `Entry ${i + 1} must have valid grade points` };
    }

    if (entry.gradePoints < 0) {
      return { valid: false, error: `Grade points for "${entry.grade}" cannot be negative` };
    }

    if (entry.gradePoints > 10) {
      return { valid: false, error: `Grade points for "${entry.grade}" cannot exceed 10` };
    }

    if (gradeNames.has(entry.grade)) {
      return { valid: false, error: `Duplicate grade name: "${entry.grade}"` };
    }
    gradeNames.add(entry.grade);
  }

  return { valid: true, error: null };
}

/**
 * Sanitize numeric input (parse and clamp to range).
 * @param {*} value - raw input value
 * @param {number} min - minimum allowed value
 * @param {number} max - maximum allowed value
 * @returns {number|null} sanitized number, or null if not parseable
 */
export function sanitizeNumericInput(value, min = 0, max = Infinity) {
  if (value === null || value === undefined || value === '') return null;

  const num = Number(value);

  if (isNaN(num)) return null;

  return Math.min(Math.max(num, min), max);
}
