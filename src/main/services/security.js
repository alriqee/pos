const axios = require('axios');
const db = require('../db');

// In a real scenario, this URL would be your control server.
// Set this to your actual API endpoint for remote locking capability.
const CONTROL_URL = process.env.CONTROL_URL || 'https://api.myposservice.com/check-license';

async function checkLockStatus() {
    if (!CONTROL_URL || CONTROL_URL.includes('myposservice.com')) {
        console.log('Security check: Using placeholder URL or no URL. Skipping remote check.');
        return isLockedLocally();
    }

    try {
        // Short timeout (2s) to not block startup if offline
        const response = await axios.get(CONTROL_URL, { timeout: 2000 });
        const { locked, message } = response.data;

        if (locked) {
            db.saveSetting('app_locked', 'true');
            db.saveSetting('lock_message', message || 'Software Locked');
            return true;
        } else {
            db.saveSetting('app_locked', 'false');
            return false;
        }
    } catch (error) {
        // Offline or Timeout
        console.log('Security check: Remote server unreachable. Using local status.');
        return isLockedLocally();
    }
}


function isLockedLocally() {
    try {
        return db.getSetting('app_locked') === 'true';
    } catch (err) {
        return false;
    }
}

module.exports = {
    checkLockStatus,
    isLockedLocally
};
