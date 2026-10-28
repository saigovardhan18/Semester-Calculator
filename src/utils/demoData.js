/**
 * Demo data generator for the academic dashboard.
 * Creates realistic academic data for testing and demonstration purposes.
 */

/**
 * Simple UUID v4 generator (no external dependency needed).
 * @returns {string}
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get a date string N days from now.
 * @param {number} daysOffset - positive = future, negative = past
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
function dateFromNow(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

/**
 * Get a full ISO datetime string N days from now at a given hour.
 * @param {number} daysOffset
 * @param {number} hour - 0-23
 * @param {number} minute - 0-59
 * @returns {string} ISO datetime string
 */
function datetimeFromNow(daysOffset, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * Generate complete demo data for testing.
 * Creates:
 * - 1 active semester (Semester 4) with 5 subjects and assessments
 * - 1 historical semester (Semester 3) with completed grades
 * - Upcoming exams
 * - Grading policies
 *
 * @returns {{ semesters: Array, subjects: Array, assessments: Array, exams: Array, gradingPolicies: Array, settings: object }}
 */
export function generateDemoData() {
  // ─── Semester IDs ──────────────────────────────────────────────
  const sem4Id = generateId();
  const sem3Id = generateId();

  // ─── Subject IDs for Semester 4 (active) ───────────────────────
  const dsaId = generateId();
  const deId = generateId();
  const mathId = generateId();
  const oopId = generateId();
  const cnId = generateId();

  // ─── Subject IDs for Semester 3 (historical) ──────────────────
  const dbmsId = generateId();
  const osId = generateId();
  const mathIIId = generateId();
  const seId = generateId();

  // ─── Semesters ─────────────────────────────────────────────────
  const semesters = [
    {
      id: sem4Id,
      name: 'Semester 4',
      year: new Date().getFullYear(),
      term: 'Spring',
      status: 'active',
      startDate: dateFromNow(-60),
      endDate: dateFromNow(30),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: sem3Id,
      name: 'Semester 3',
      year: new Date().getFullYear() - 1,
      term: 'Fall',
      status: 'completed',
      startDate: dateFromNow(-210),
      endDate: dateFromNow(-120),
      createdAt: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // ─── Subjects ──────────────────────────────────────────────────
  const subjects = [
    // Semester 4 subjects
    {
      id: dsaId,
      semesterId: sem4Id,
      name: 'Data Structures and Algorithms',
      code: 'CS2001',
      credits: 4,
      color: '#6366f1', // indigo
      gradingType: 'absolute',
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: deId,
      semesterId: sem4Id,
      name: 'Digital Electronics',
      code: 'EC2003',
      credits: 3,
      color: '#f59e0b', // amber
      gradingType: 'absolute',
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: mathId,
      semesterId: sem4Id,
      name: 'Mathematics IV',
      code: 'MA2004',
      credits: 4,
      color: '#10b981', // emerald
      gradingType: 'relative',
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: oopId,
      semesterId: sem4Id,
      name: 'Object-Oriented Programming',
      code: 'CS2002',
      credits: 3,
      color: '#8b5cf6', // violet
      gradingType: 'absolute',
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: cnId,
      semesterId: sem4Id,
      name: 'Computer Networks',
      code: 'CS2004',
      credits: 3,
      color: '#ef4444', // red
      gradingType: 'absolute',
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Semester 3 subjects (historical, with final grades)
    {
      id: dbmsId,
      semesterId: sem3Id,
      name: 'Database Management Systems',
      code: 'CS1005',
      credits: 4,
      color: '#6366f1',
      gradingType: 'absolute',
      finalGrade: 'A+',
      finalGradePoints: 9,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: osId,
      semesterId: sem3Id,
      name: 'Operating Systems',
      code: 'CS1004',
      credits: 4,
      color: '#f59e0b',
      gradingType: 'absolute',
      finalGrade: 'A',
      finalGradePoints: 8,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: mathIIId,
      semesterId: sem3Id,
      name: 'Mathematics III',
      code: 'MA1003',
      credits: 4,
      color: '#10b981',
      gradingType: 'relative',
      finalGrade: 'O',
      finalGradePoints: 10,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: seId,
      semesterId: sem3Id,
      name: 'Software Engineering',
      code: 'CS1006',
      credits: 3,
      color: '#8b5cf6',
      gradingType: 'absolute',
      finalGrade: 'A+',
      finalGradePoints: 9,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // ─── Assessments for Semester 4 ────────────────────────────────
  const assessments = [
    // DSA - 6 assessments (4 completed, 2 pending)
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'Quiz 1',
      type: 'quiz',
      maximumMarks: 20,
      weightage: 5,
      marksScored: 18,
      classAverage: 14.5,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-45),
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'Quiz 2',
      type: 'quiz',
      maximumMarks: 20,
      weightage: 5,
      marksScored: 16,
      classAverage: 13.2,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-30),
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'Assignment 1',
      type: 'assignment',
      maximumMarks: 50,
      weightage: 10,
      marksScored: 42,
      classAverage: 35,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-25),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'Midterm Exam',
      type: 'midterm',
      maximumMarks: 50,
      weightage: 30,
      marksScored: 38,
      classAverage: 30.5,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-15),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'Lab Assessment',
      type: 'lab',
      maximumMarks: 30,
      weightage: 10,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(5),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'End Semester Exam',
      type: 'endterm',
      maximumMarks: 100,
      weightage: 40,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(20),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Digital Electronics - 5 assessments (3 completed, 2 pending)
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Quiz 1',
      type: 'quiz',
      maximumMarks: 25,
      weightage: 10,
      marksScored: 20,
      classAverage: 17,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-40),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Lab Practical',
      type: 'lab',
      maximumMarks: 40,
      weightage: 15,
      marksScored: 34,
      classAverage: null,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-20),
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Midterm Exam',
      type: 'midterm',
      maximumMarks: 50,
      weightage: 25,
      marksScored: 36,
      classAverage: 28,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-12),
      createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Quiz 2',
      type: 'quiz',
      maximumMarks: 25,
      weightage: 10,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(8),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'End Semester Exam',
      type: 'endterm',
      maximumMarks: 100,
      weightage: 40,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(22),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Mathematics IV - 4 assessments (2 completed, 2 pending)
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'Tutorial Test 1',
      type: 'quiz',
      maximumMarks: 30,
      weightage: 10,
      marksScored: 24,
      classAverage: 19.5,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-35),
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'Midterm Exam',
      type: 'midterm',
      maximumMarks: 50,
      weightage: 30,
      marksScored: 41,
      classAverage: 32,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-14),
      createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'Tutorial Test 2',
      type: 'quiz',
      maximumMarks: 30,
      weightage: 10,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(3),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'End Semester Exam',
      type: 'endterm',
      maximumMarks: 100,
      weightage: 50,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(25),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // OOP - 5 assessments (3 completed, 2 pending)
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'Lab 1 - Basics',
      type: 'lab',
      maximumMarks: 25,
      weightage: 10,
      marksScored: 23,
      classAverage: 20,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-42),
      createdAt: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'Quiz 1',
      type: 'quiz',
      maximumMarks: 20,
      weightage: 5,
      marksScored: 15,
      classAverage: 12.8,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-28),
      createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'Midterm Exam',
      type: 'midterm',
      maximumMarks: 50,
      weightage: 25,
      marksScored: 40,
      classAverage: 32,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-13),
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'Lab 2 - Project',
      type: 'lab',
      maximumMarks: 50,
      weightage: 20,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(10),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'End Semester Exam',
      type: 'endterm',
      maximumMarks: 100,
      weightage: 40,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(24),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Computer Networks - 5 assessments (2 completed, 3 pending)
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Quiz 1',
      type: 'quiz',
      maximumMarks: 20,
      weightage: 5,
      marksScored: 14,
      classAverage: 11,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-38),
      createdAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Midterm Exam',
      type: 'midterm',
      maximumMarks: 50,
      weightage: 25,
      marksScored: 33,
      classAverage: 27,
      classAverageType: 'raw',
      status: 'completed',
      date: dateFromNow(-11),
      createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Lab Assessment',
      type: 'lab',
      maximumMarks: 30,
      weightage: 15,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(6),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Quiz 2',
      type: 'quiz',
      maximumMarks: 20,
      weightage: 5,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(12),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'End Semester Exam',
      type: 'endterm',
      maximumMarks: 100,
      weightage: 50,
      marksScored: null,
      classAverage: null,
      classAverageType: 'raw',
      status: 'pending',
      date: dateFromNow(26),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // ─── Exams (upcoming) ─────────────────────────────────────────
  const exams = [
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'Mathematics IV - Tutorial Test 2',
      date: datetimeFromNow(3, 10, 0),
      time: '10:00',
      venue: 'Room 204, Block A',
      type: 'quiz',
      status: 'upcoming',
      notes: 'Chapters 5-8: Fourier Series, Laplace Transform',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'DSA - Lab Assessment',
      date: datetimeFromNow(5, 14, 0),
      time: '14:00',
      venue: 'Lab 301, CS Block',
      type: 'lab',
      status: 'upcoming',
      notes: 'Implement BST and Graph algorithms. Bring laptop.',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Computer Networks - Lab Assessment',
      date: datetimeFromNow(6, 11, 0),
      time: '11:00',
      venue: 'Lab 105, EC Block',
      type: 'lab',
      status: 'upcoming',
      notes: 'Socket programming and network configuration',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Digital Electronics - Quiz 2',
      date: datetimeFromNow(8, 9, 30),
      time: '09:30',
      venue: 'Room 102, Block B',
      type: 'quiz',
      status: 'upcoming',
      notes: 'Sequential circuits, Flip-flops, Counters',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'OOP - Lab 2 Project Submission',
      date: datetimeFromNow(10, 16, 0),
      time: '16:00',
      venue: 'Lab 302, CS Block',
      type: 'lab',
      status: 'upcoming',
      notes: 'Final project demo: Design patterns implementation',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Computer Networks - Quiz 2',
      date: datetimeFromNow(12, 10, 0),
      time: '10:00',
      venue: 'Room 204, Block A',
      type: 'quiz',
      status: 'upcoming',
      notes: 'Transport and application layer protocols',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: dsaId,
      semesterId: sem4Id,
      name: 'DSA - End Semester Exam',
      date: datetimeFromNow(20, 9, 0),
      time: '09:00',
      venue: 'Exam Hall 1',
      type: 'endterm',
      status: 'upcoming',
      notes: 'Comprehensive: All topics covered in the course',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: deId,
      semesterId: sem4Id,
      name: 'Digital Electronics - End Semester Exam',
      date: datetimeFromNow(22, 14, 0),
      time: '14:00',
      venue: 'Exam Hall 2',
      type: 'endterm',
      status: 'upcoming',
      notes: 'All units. Focus on combinational and sequential circuits.',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: oopId,
      semesterId: sem4Id,
      name: 'OOP - End Semester Exam',
      date: datetimeFromNow(24, 9, 0),
      time: '09:00',
      venue: 'Exam Hall 1',
      type: 'endterm',
      status: 'upcoming',
      notes: 'Inheritance, Polymorphism, Design Patterns, SOLID principles',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: mathId,
      semesterId: sem4Id,
      name: 'Mathematics IV - End Semester Exam',
      date: datetimeFromNow(25, 14, 0),
      time: '14:00',
      venue: 'Exam Hall 2',
      type: 'endterm',
      status: 'upcoming',
      notes: 'All units including complex analysis and probability',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      subjectId: cnId,
      semesterId: sem4Id,
      name: 'Computer Networks - End Semester Exam',
      date: datetimeFromNow(26, 9, 0),
      time: '09:00',
      venue: 'Exam Hall 1',
      type: 'endterm',
      status: 'upcoming',
      notes: 'OSI model, TCP/IP, Routing, Network security',
      createdAt: new Date().toISOString(),
    },
  ];

  // ─── Grading Policies ─────────────────────────────────────────
  const gradingPolicies = [
    {
      id: generateId(),
      name: 'Absolute Grading (Default)',
      type: 'absolute',
      isDefault: true,
      boundaries: [
        { grade: 'O', minScore: 91, gradePoints: 10 },
        { grade: 'A+', minScore: 81, gradePoints: 9 },
        { grade: 'A', minScore: 71, gradePoints: 8 },
        { grade: 'B+', minScore: 61, gradePoints: 7 },
        { grade: 'B', minScore: 51, gradePoints: 6 },
        { grade: 'C', minScore: 41, gradePoints: 5 },
        { grade: 'P', minScore: 30, gradePoints: 4 },
        { grade: 'F', minScore: 0, gradePoints: 0 },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Relative Grading (Mathematics)',
      type: 'relative',
      isDefault: false,
      mean: null, // Will be set when class data is available
      stdDev: null,
      bands: [
        { grade: 'O', sigmaOffset: 1.5, gradePoints: 10 },
        { grade: 'A+', sigmaOffset: 1.0, gradePoints: 9 },
        { grade: 'A', sigmaOffset: 0.5, gradePoints: 8 },
        { grade: 'B+', sigmaOffset: 0.0, gradePoints: 7 },
        { grade: 'B', sigmaOffset: -0.5, gradePoints: 6 },
        { grade: 'C', sigmaOffset: -1.0, gradePoints: 5 },
        { grade: 'P', sigmaOffset: -1.5, gradePoints: 4 },
        { grade: 'F', sigmaOffset: null, gradePoints: 0 },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  // ─── Settings ──────────────────────────────────────────────────
  const settings = {
    id: 'app-settings',
    theme: 'system',
    defaultGradingPolicy: gradingPolicies[0].id,
    showClassAverage: true,
    showGradePredictor: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    semesters,
    subjects,
    assessments,
    exams,
    gradingPolicies,
    settings,
  };
}

/**
 * Load demo data into IndexedDB.
 * First clears all existing data, then loads the demo data.
 * @returns {Promise<void>}
 */
export async function loadDemoData() {
  // Dynamically import the db module to avoid circular dependencies
  // and because the db module may not be set up yet at import time.
  const { getDB } = await import('../db/index.js');
  const db = await getDB();

  // Clear existing data first
  await clearAllData();

  const data = generateDemoData();

  // Use a transaction to load all data atomically
  const storeNames = ['semesters', 'subjects', 'assessments', 'exams', 'gradingPolicies', 'settings'];
  const tx = db.transaction(storeNames, 'readwrite');

  const promises = [];

  for (const semester of data.semesters) {
    promises.push(tx.objectStore('semesters').put(semester));
  }

  for (const subject of data.subjects) {
    promises.push(tx.objectStore('subjects').put(subject));
  }

  for (const assessment of data.assessments) {
    promises.push(tx.objectStore('assessments').put(assessment));
  }

  for (const exam of data.exams) {
    promises.push(tx.objectStore('exams').put(exam));
  }

  for (const policy of data.gradingPolicies) {
    promises.push(tx.objectStore('gradingPolicies').put(policy));
  }

  promises.push(tx.objectStore('settings').put(data.settings));

  promises.push(tx.done);

  await Promise.all(promises);
}

/**
 * Clear all data from IndexedDB.
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  const { getDB } = await import('../db/index.js');
  const db = await getDB();

  const storeNames = ['semesters', 'subjects', 'assessments', 'exams', 'gradingPolicies', 'settings'];

  // Only clear stores that actually exist in the database
  const existingStores = [...db.objectStoreNames];
  const storesToClear = storeNames.filter((name) => existingStores.includes(name));

  if (storesToClear.length === 0) return;

  const tx = db.transaction(storesToClear, 'readwrite');
  const promises = storesToClear.map((name) => tx.objectStore(name).clear());
  promises.push(tx.done);

  await Promise.all(promises);
}
