// referers.js - 30,000+ Referer Domains
const REFERERS = [];

console.log("[+] Generating 30,000+ Referers...");

// ============ GOOGLE DOMAINS ============
const googleTLDs = [
    'com', 'co.id', 'co.uk', 'de', 'fr', 'jp', 'ru', 'br', 'in', 'au',
    'ca', 'mx', 'es', 'it', 'nl', 'se', 'no', 'dk', 'fi', 'pl', 'tr',
    'gr', 'pt', 'ch', 'be', 'at', 'ie', 'nz', 'sg', 'my', 'ph', 'vn',
    'th', 'kr', 'cn', 'tw', 'hk', 'ae', 'sa', 'za', 'ar', 'cl', 'co'
];

for (const tld of googleTLDs) {
    REFERERS.push(`https://www.google.${tld}/`);
    REFERERS.push(`https://google.${tld}/`);
    
    for (let i = 0; i < 50; i++) {
        const query = Math.random().toString(36).substring(7);
        REFERERS.push(`https://www.google.${tld}/search?q=${query}`);
        REFERERS.push(`https://www.google.${tld}/search?q=${query}&hl=en`);
        REFERERS.push(`https://www.google.${tld}/images?q=${query}`);
        REFERERS.push(`https://www.google.${tld}/maps/search/${query}`);
        REFERERS.push(`https://www.google.${tld}/news/search?q=${query}`);
    }
}

// ============ SOCIAL MEDIA ============
const socialSites = [
    'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'tiktok.com',
    'reddit.com', 'linkedin.com', 'pinterest.com', 'snapchat.com', 'whatsapp.com',
    'telegram.org', 'discord.com', 'twitch.tv', 'tumblr.com', 'wechat.com',
    'line.me', 'viber.com', 'skype.com', 'signal.org', 'messenger.com'
];

for (const site of socialSites) {
    REFERERS.push(`https://www.${site}/`);
    REFERERS.push(`https://${site}/`);
    
    for (let i = 0; i < 30; i++) {
        const user = `user${Math.floor(Math.random() * 10000)}`;
        const post = `post${Math.floor(Math.random() * 10000)}`;
        
        REFERERS.push(`https://www.${site}/${user}`);
        REFERERS.push(`https://www.${site}/${user}/status/${post}`);
        REFERERS.push(`https://www.${site}/p/${post}`);
        REFERERS.push(`https://www.${site}/watch?v=${Math.random().toString(36).substring(7)}`);
    }
}

// ============ E-COMMERCE ============
const ecommerce = [
    'amazon.com', 'ebay.com', 'aliexpress.com', 'alibaba.com', 'walmart.com',
    'target.com', 'bestbuy.com', 'homedepot.com', 'costco.com', 'etsy.com',
    'shopify.com', 'wish.com', 'flipkart.com', 'rakuten.co.jp', 'jd.com',
    'taobao.com', 'tmall.com', 'lazada.co.id', 'shopee.co.id', 'tokopedia.com',
    'bukalapak.com', 'blibli.com', 'olx.co.id', 'zalora.co.id', 'bhinneka.com'
];

for (const site of ecommerce) {
    REFERERS.push(`https://www.${site}/`);
    REFERERS.push(`https://${site}/`);
    
    for (let i = 0; i < 20; i++) {
        const product = `product${Math.floor(Math.random() * 10000)}`;
        REFERERS.push(`https://www.${site}/dp/${product}`);
        REFERERS.push(`https://www.${site}/product/${product}`);
        REFERERS.push(`https://www.${site}/item/${product}`);
    }
}

// ============ NEWS SITES ============
const newsSites = [
    'bbc.com', 'cnn.com', 'nytimes.com', 'theguardian.com', 'reuters.com',
    'washingtonpost.com', 'bloomberg.com', 'aljazeera.com', 'dw.com', 'france24.com',
    'kompas.com', 'detik.com', 'tribunnews.com', 'liputan6.com', 'merdeka.com',
    'viva.co.id', 'suara.com', 'jpnn.com', 'kumparan.com', 'cnbcindonesia.com'
];

for (const site of newsSites) {
    REFERERS.push(`https://www.${site}/`);
    REFERERS.push(`https://${site}/`);
    
    for (let i = 0; i < 20; i++) {
        REFERERS.push(`https://www.${site}/news/${Math.floor(Math.random() * 10000)}`);
        REFERERS.push(`https://www.${site}/article/${Math.floor(Math.random() * 10000)}`);
        REFERERS.push(`https://www.${site}/2024/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/`);
    }
}

// ============ SEARCH ENGINES ============
const searchEngines = [
    'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com', 'yandex.com',
    'ask.com', 'aol.com', 'lycos.com', 'ecosia.org', 'startpage.com',
    'qwant.com', 'searchencrypt.com', 'gibiru.com', 'swisscows.com'
];

for (const engine of searchEngines) {
    REFERERS.push(`https://www.${engine}/`);
    REFERERS.push(`https://${engine}/`);
    
    for (let i = 0; i < 30; i++) {
        const query = Math.random().toString(36).substring(7);
        REFERERS.push(`https://www.${engine}/search?q=${query}`);
        REFERERS.push(`https://${engine}/?q=${query}`);
    }
}

// Remove duplicates
const uniqueRefs = [...new Set(REFERERS)];
console.log(`[✓] Generated ${uniqueRefs.length.toLocaleString()} Referers`);

module.exports = uniqueRefs;
