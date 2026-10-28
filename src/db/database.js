import { openDB } from 'idb';

const DB_NAME = 'academicDashboard';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Opens and returns the IndexedDB database connection.
 * Reuses existing connection if available.
 * @returns {Promise<import('idb').IDBPDatabase>}
 */
export async function getDB() {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Semesters store
      if (!db.objectStoreNames.contains('semesters')) {
        const semesterStore = db.createObjectStore('semesters', { keyPath: 'id' });
        semesterStore.createIndex('name', 'name', { unique: false });
        semesterStore.createIndex('year', 'year', { unique: false });
        semesterStore.createIndex('isActive', 'isActive', { unique: false });
        semesterStore.createIndex('isArchived', 'isArchived', { unique: false });
        semesterStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Subjects store
      if (!db.objectStoreNames.contains('subjects')) {
        const subjectStore = db.createObjectStore('subjects', { keyPath: 'id' });
        subjectStore.createIndex('semesterId', 'semesterId', { unique: false });
        subjectStore.createIndex('name', 'name', { unique: false });
        subjectStore.createIndex('code', 'code', { unique: false });
        subjectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Assessments store
      if (!db.objectStoreNames.contains('assessments')) {
        const assessmentStore = db.createObjectStore('assessments', { keyPath: 'id' });
        assessmentStore.createIndex('subjectId', 'subjectId', { unique: false });
        assessmentStore.createIndex('semesterId', 'semesterId', { unique: false });
        assessmentStore.createIndex('status', 'status', { unique: false });
      }

      // Exams store
      if (!db.objectStoreNames.contains('exams')) {
        const examStore = db.createObjectStore('exams', { keyPath: 'id' });
        examStore.createIndex('subjectId', 'subjectId', { unique: false });
        examStore.createIndex('semesterId', 'semesterId', { unique: false });
        examStore.createIndex('date', 'date', { unique: false });
        examStore.createIndex('type', 'type', { unique: false });
      }

      // Grading Policies store
      if (!db.objectStoreNames.contains('gradingPolicies')) {
        const gradingStore = db.createObjectStore('gradingPolicies', { keyPath: 'id' });
        gradingStore.createIndex('semesterId', 'semesterId', { unique: false });
        gradingStore.createIndex('subjectId', 'subjectId', { unique: false });
      }

      // Historical Semesters store
      if (!db.objectStoreNames.contains('historicalSemesters')) {
        const historicalStore = db.createObjectStore('historicalSemesters', { keyPath: 'id' });
        historicalStore.createIndex('year', 'year', { unique: false });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}
