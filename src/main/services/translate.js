const translate = require('google-translate-api-x');

// Basic Offline Dictionary for common items
const OFFLINE_DICT = {
    'apple': 'تفاحة',
    'banana': 'موز',
    'orange': 'برتقال',
    'milk': 'حليب',
    'bread': 'خبز',
    'water': 'ماء',
    'coffee': 'قهوة',
    'tea': 'شاي',
    'sugar': 'سكر',
    'rice': 'أرز'
};

const cache = new Map();

async function translateToArabic(text) {
    if (!text) return '';
    const lowerText = text.toLowerCase().trim();

    // 1. Check Offline Dictionary first
    if (OFFLINE_DICT[lowerText]) {
        return OFFLINE_DICT[lowerText];
    }

    // 2. Check Cache
    if (cache.has(text)) return cache.get(text);

    try {
        // 3. Try Online Translation
        const res = await translate(text, { to: 'ar', forceBatch: false, autoCorrect: true });
        const translated = res.text;
        cache.set(text, translated);
        return translated;
    } catch (error) {
        console.log('Translation failed (likely offline). returning empty to allow manual entry.');
        return ''; // Return empty to let user type manual name without error
    }
}

module.exports = {
    translateToArabic
};
