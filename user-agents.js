// user-agents.js - 50,000+ User Agents
const UAS = [];

console.log("[+] Generating 50,000+ User Agents...");

// ============ WINDOWS CHROME ============
for (let i = 0; i < 10000; i++) {
    const winVer = Math.floor(Math.random() * 5) + 6; // 6-10
    const winBuild = Math.floor(Math.random() * 5); // 0-4
    const chromeVer = Math.floor(Math.random() * 30) + 100; // 100-129
    const buildVer = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const revVer = Math.floor(Math.random() * 900) + 100; // 100-999
    
    UAS.push(`Mozilla/5.0 (Windows NT ${winVer}.${winBuild}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36`);
    UAS.push(`Mozilla/5.0 (Windows NT ${winVer}.${winBuild}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36 Edg/${chromeVer}.0.${buildVer}.${revVer}`);
    UAS.push(`Mozilla/5.0 (Windows NT ${winVer}.${winBuild}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36 OPR/${chromeVer}.0.${buildVer}.${revVer}`);
    UAS.push(`Mozilla/5.0 (Windows NT ${winVer}.${winBuild}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36 Brave/${chromeVer}.0.${buildVer}.${revVer}`);
}

// ============ WINDOWS FIREFOX ============
for (let i = 0; i < 5000; i++) {
    const winVer = Math.floor(Math.random() * 5) + 6;
    const winBuild = Math.floor(Math.random() * 5);
    const ffVer = Math.floor(Math.random() * 30) + 100; // 100-129
    
    UAS.push(`Mozilla/5.0 (Windows NT ${winVer}.${winBuild}; Win64; x64; rv:${ffVer}.0) Gecko/20100101 Firefox/${ffVer}.0`);
}

// ============ MAC CHROME ============
for (let i = 0; i < 5000; i++) {
    const macVer = Math.floor(Math.random() * 5) + 10; // 10-14
    const macSub = Math.floor(Math.random() * 5); // 0-4
    const chromeVer = Math.floor(Math.random() * 30) + 100;
    const buildVer = Math.floor(Math.random() * 9000) + 1000;
    const revVer = Math.floor(Math.random() * 900) + 100;
    
    UAS.push(`Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}_${macSub}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36`);
}

// ============ MAC SAFARI ============
for (let i = 0; i < 3000; i++) {
    const macVer = Math.floor(Math.random() * 5) + 10;
    const macSub = Math.floor(Math.random() * 5);
    const safariVer = Math.floor(Math.random() * 4) + 14; // 14-17
    
    UAS.push(`Mozilla/5.0 (Macintosh; Intel Mac OS X ${macVer}_${macSub}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${safariVer}.0 Safari/605.1.15`);
}

// ============ LINUX ============
for (let i = 0; i < 5000; i++) {
    const chromeVer = Math.floor(Math.random() * 30) + 100;
    const buildVer = Math.floor(Math.random() * 9000) + 1000;
    const revVer = Math.floor(Math.random() * 900) + 100;
    const ffVer = Math.floor(Math.random() * 30) + 100;
    
    UAS.push(`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36`);
    UAS.push(`Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Safari/537.36`);
    UAS.push(`Mozilla/5.0 (X11; Linux x86_64; rv:${ffVer}.0) Gecko/20100101 Firefox/${ffVer}.0`);
}

// ============ ANDROID ============
for (let i = 0; i < 8000; i++) {
    const androidVer = Math.floor(Math.random() * 5) + 10; // 10-14
    const chromeVer = Math.floor(Math.random() * 30) + 100;
    const buildVer = Math.floor(Math.random() * 9000) + 1000;
    const revVer = Math.floor(Math.random() * 900) + 100;
    
    UAS.push(`Mozilla/5.0 (Linux; Android ${androidVer}; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Mobile Safari/537.36`);
    UAS.push(`Mozilla/5.0 (Linux; Android ${androidVer}; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Mobile Safari/537.36`);
    UAS.push(`Mozilla/5.0 (Linux; Android ${androidVer}; Xiaomi Mi 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVer}.0.${buildVer}.${revVer} Mobile Safari/537.36`);
}

// ============ IOS ============
for (let i = 0; i < 5000; i++) {
    const iosVer = Math.floor(Math.random() * 4) + 14; // 14-17
    const chromeVer = Math.floor(Math.random() * 30) + 100;
    const buildVer = Math.floor(Math.random() * 9000) + 1000;
    const revVer = Math.floor(Math.random() * 900) + 100;
    
    UAS.push(`Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer}_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${iosVer}.0 Mobile/15E148 Safari/604.1`);
    UAS.push(`Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVer}_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${chromeVer}.0.${buildVer}.${revVer} Mobile/15E148 Safari/604.1`);
    UAS.push(`Mozilla/5.0 (iPad; CPU OS ${iosVer}_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${iosVer}.0 Mobile/15E148 Safari/604.1`);
}

// ============ BOTS & CRAWLERS ============
const bots = [
    'Googlebot/2.1 (+http://www.google.com/bot.html)',
    'Googlebot-Image/1.0',
    'bingbot/2.0 (+http://www.bing.com/bingbot.htm)',
    'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
    'Twitterbot/1.0',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Discordbot/2.0 (+https://discordapp.com)',
    'TelegramBot (like TwitterBot)',
    'WhatsApp/2.0 (+http://www.whatsapp.com)',
    'YandexBot/3.0 (+http://yandex.com/bots)',
];

for (let i = 0; i < 1000; i++) {
    UAS.push(bots[Math.floor(Math.random() * bots.length)]);
}

// Remove duplicates
const uniqueUAS = [...new Set(UAS)];
console.log(`[✓] Generated ${uniqueUAS.length.toLocaleString()} User Agents`);

module.exports = uniqueUAS;
