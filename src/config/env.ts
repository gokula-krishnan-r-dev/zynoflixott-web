const env = {
    // Database settings
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ott',

    // API settings
    API_BASE_URL: process.env.API_BASE_URL || '/api',

    // Feature flags
    ENABLE_ADVERTISEMENT: process.env.ENABLE_ADVERTISEMENT === 'true' || true,

    // Other settings
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en',
};

export default env; 