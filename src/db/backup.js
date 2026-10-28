import { getDB } from './database';

const APP_VERSION = '1.0.0';
const BACKUP_VERSION = 1;

const STORE_NAMES = [
  'semesters',
  'subjects',
  'assessments',
  'exams',
  'gradingPolicies',
  'historicalSemesters',
  'settings',
];

/**
 * Export all data from all stores as a JSON backup object.
 * @returns {Promise<Object>} Backup object with metadata and all store data
 */
export async function exportBackup() {
  try {
    const db = await getDB();
    const backup = {
      metadata: {
        version: BACKUP_VERSION,
        appVersion: APP_VERSION,
        exportDate: new Date().toISOString(),
        storeNames: STORE_NAMES,
      },
      data: {},
    };

    for (const storeName of STORE_NAMES) {
      backup.data[storeName] = await db.getAll(storeName);
    }

    return backup;
  } catch (error) {
    console.error('Failed to export backup:', error);
    throw error;
  }
}

/**
 * Validate that a backup object has the correct structure.
 * @param {Object} data - The backup data to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBackupStructure(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('Backup data must be a valid object');
    return { valid: false, errors };
  }

  // Check metadata
  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Backup must contain a metadata object');
  } else {
    if (typeof data.metadata.version !== 'number') {
      errors.push('Backup metadata must contain a numeric version');
    }
    if (!data.metadata.exportDate) {
      errors.push('Backup metadata must contain an exportDate');
    }
  }

  // Check data object
  if (!data.data || typeof data.data !== 'object') {
    errors.push('Backup must contain a data object');
    return { valid: false, errors };
  }

  // Check that all expected stores exist and are arrays
  for (const storeName of STORE_NAMES) {
    if (!(storeName in data.data)) {
      errors.push(`Backup data is missing store: ${storeName}`);
    } else if (!Array.isArray(data.data[storeName])) {
      errors.push(`Backup data store '${storeName}' must be an array`);
    }
  }

  // Validate required fields in key stores
  if (Array.isArray(data.data.semesters)) {
    for (const semester of data.data.semesters) {
      if (!semester.id || !semester.name) {
        errors.push('Each semester must have an id and name');
        break;
      }
    }
  }

  if (Array.isArray(data.data.subjects)) {
    for (const subject of data.data.subjects) {
      if (!subject.id || !subject.semesterId || !subject.name) {
        errors.push('Each subject must have an id, semesterId, and name');
        break;
      }
    }
  }

  if (Array.isArray(data.data.assessments)) {
    for (const assessment of data.data.assessments) {
      if (!assessment.id || !assessment.subjectId || !assessment.semesterId) {
        errors.push('Each assessment must have an id, subjectId, and semesterId');
        break;
      }
    }
  }

  if (Array.isArray(data.data.settings)) {
    for (const setting of data.data.settings) {
      if (!setting.key) {
        errors.push('Each setting must have a key');
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Import a backup, replacing all existing data.
 * @param {Object} jsonData - The backup data object to import
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function importBackup(jsonData) {
  try {
    // Validate structure
    const validation = validateBackupStructure(jsonData);
    if (!validation.valid) {
      return {
        success: false,
        message: `Invalid backup structure: ${validation.errors.join('; ')}`,
      };
    }

    const db = await getDB();
    const tx = db.transaction(STORE_NAMES, 'readwrite');

    // Clear all existing data
    for (const storeName of STORE_NAMES) {
      await tx.objectStore(storeName).clear();
    }

    // Import all data
    for (const storeName of STORE_NAMES) {
      const store = tx.objectStore(storeName);
      const items = jsonData.data[storeName] || [];
      for (const item of items) {
        await store.add(item);
      }
    }

    await tx.done;

    const totalRecords = STORE_NAMES.reduce(
      (sum, name) => sum + (jsonData.data[name]?.length || 0),
      0
    );

    return {
      success: true,
      message: `Successfully imported ${totalRecords} records across ${STORE_NAMES.length} stores`,
    };
  } catch (error) {
    console.error('Failed to import backup:', error);
    return {
      success: false,
      message: `Import failed: ${error.message}`,
    };
  }
}
