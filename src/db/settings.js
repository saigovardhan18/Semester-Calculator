import { getDB } from './database';

/**
 * Get a setting value by key.
 * @param {string} key
 * @returns {Promise<*>} The setting value, or undefined if not set
 */
export async function getSetting(key) {
  try {
    const db = await getDB();
    const setting = await db.get('settings', key);
    return setting ? setting.value : undefined;
  } catch (error) {
    console.error('Failed to get setting:', error);
    throw error;
  }
}

/**
 * Set a setting value.
 * @param {string} key
 * @param {*} value
 * @returns {Promise<void>}
 */
export async function setSetting(key, value) {
  try {
    const db = await getDB();
    await db.put('settings', { key, value, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to set setting:', error);
    throw error;
  }
}

/**
 * Get all settings as an array.
 * @returns {Promise<Array>}
 */
export async function getAllSettings() {
  try {
    const db = await getDB();
    return await db.getAll('settings');
  } catch (error) {
    console.error('Failed to get all settings:', error);
    throw error;
  }
}

/**
 * Get the current theme setting.
 * @returns {Promise<'light'|'dark'|'system'>}
 */
export async function getTheme() {
  try {
    const theme = await getSetting('theme');
    return theme || 'system';
  } catch (error) {
    console.error('Failed to get theme:', error);
    return 'system';
  }
}

/**
 * Set the theme setting.
 * @param {'light'|'dark'|'system'} theme
 * @returns {Promise<void>}
 */
export async function setTheme(theme) {
  try {
    if (!['light', 'dark', 'system'].includes(theme)) {
      throw new Error(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'system'`);
    }
    await setSetting('theme', theme);
  } catch (error) {
    console.error('Failed to set theme:', error);
    throw error;
  }
}
