const axios = require('axios');
const db = require('../db');

// In a real scenario, this URL would be your control server.
const CONTROL_URL = 'https://api.myposservice.com/check-license';

async function checkLockStatus() {
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
