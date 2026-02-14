// cf-bypass.js - CloudFlare Bypass for 50K RPS
const crypto = require('crypto');

class CloudFlareBypass {
    constructor() {
        this.countries = [
            'US', 'GB', 'DE', 'FR', 'CA', 'AU', 'JP', 'ID', 'SG', 'MY', 
            'IN', 'BR', 'MX', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'TR',
            'AE', 'SA', 'ZA', 'AR', 'CL', 'CO', 'KR', 'TW', 'HK', 'TH',
            'VN', 'PH', 'NZ', 'IE', 'AT', 'CH', 'BE', 'PT', 'GR', 'CZ'
        ];
        
        // PRE-GENERATE TOKENS UNTUK KECEPATAN
        console.log("[+] Generating CloudFlare bypass tokens...");
        this.tokens = [];
        for (let i = 0; i < 10000; i++) {
            const timestamp = Date.now() - Math.floor(Math.random() * 86400000);
            const token = crypto
                .createHash('sha256')
                .update(`cf_${timestamp}_${i}_${Math.random()}`)
                .digest('hex')
                .substring(0, 40);
            this.tokens.push(token);
        }
        
        // PRE-GENERATE COOKIES
        console.log("[+] Generating CloudFlare cookies...");
        this.cookies = [];
        for (let i = 0; i < 10000; i++) {
            const cfduid = crypto
                .createHash('md5')
                .update(`cfduid_${Date.now()}_${i}_${Math.random()}`)
                .digest('hex')
                .substring(0, 32);
            
            const clearance = crypto
                .createHash('sha256')
                .update(`clearance_${Date.now()}_${i}_${Math.random()}`)
                .digest('hex')
                .substring(0, 40);
            
            const bm = crypto
                .createHash('md5')
                .update(`bm_${Date.now()}_${i}_${Math.random()}`)
                .digest('hex')
                .substring(0, 100);
            
            this.cookies.push(`__cfduid=${cfduid}; cf_clearance=${clearance}; __cf_bm=${bm}`);
        }
        
        console.log(`[✓] Generated ${this.tokens.length.toLocaleString()} CF tokens`);
        console.log(`[✓] Generated ${this.cookies.length.toLocaleString()} CF cookies`);
        
        // INDEX ROTATION
        this.tokenIndex = 0;
        this.cookieIndex = 0;
        this.countryIndex = 0;
    }

    getHeaders(ip, ua, referer) {
        // ROTASI CEPAT
        this.tokenIndex = (this.tokenIndex + 1) % this.tokens.length;
        this.cookieIndex = (this.cookieIndex + 1) % this.cookies.length;
        this.countryIndex = (this.countryIndex + 1) % this.countries.length;
        
        const ray = crypto.createHash('md5')
            .update(Date.now().toString() + Math.random())
            .digest('hex')
            .substring(0, 16);

        return {
            'User-Agent': ua,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            
            // CLOUDFLARE HEADERS
            'CF-IPCountry': this.countries[this.countryIndex],
            'CF-Visitor': '{"scheme":"https"}',
            'CF-Ray': ray,
            
            // IP SPOOFING
            'X-Forwarded-For': ip,
            'X-Real-IP': ip,
            'CF-Connecting-IP': ip,
            'True-Client-IP': ip,
            'X-Client-IP': ip,
            
            // REFERER
            'Referer': referer,
            
            // COOKIES
            'Cookie': this.cookies[this.cookieIndex]
        };
    }
}

module.exports = new CloudFlareBypass();