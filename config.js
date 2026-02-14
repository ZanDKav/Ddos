// config.js - Konfigurasi Bot
module.exports = {
    // GANTI DENGAN TOKEN BOT ANDA
    BOT_TOKEN: "8354132452:AAEIbSL3ujZOyjnZaCivklIImmNjoMMSDcc",
    
    // ADMIN ID (optional)
    ADMIN_ID: "7849712634",
    
    // Rate Limit Configuration
    RATE_LIMIT: {
        ENABLED: true,
        COOLDOWN: 10, // 10 detik cooldown
        MAX_ATTACKS_PER_DAY: 50
    },
    
    // Panel Mode
    PANEL: {
        MODE: 'auto',
        MAX_WORKERS: require('os').cpus().length * 2
    }
};
