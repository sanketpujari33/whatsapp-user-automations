const mongoose = require("mongoose");
const dns = require("dns");
const { exec } = require("child_process");
mongoose.set("strictQuery", true);

function isSrvUrl(url) {
    return url && url.startsWith('mongodb+srv://');
}

function parseSrvUrl(url) {
    const withoutProtocol = url.replace('mongodb+srv://', '');
    const atIndex = withoutProtocol.indexOf('@');
    const creds = withoutProtocol.slice(0, atIndex);
    const rest = withoutProtocol.slice(atIndex + 1);
    const slashIndex = rest.indexOf('/');
    const hostname = slashIndex === -1 ? rest.split('?')[0] : rest.slice(0, slashIndex);
    const pathAndQuery = slashIndex === -1 ? (rest.includes('?') ? '/' + rest.slice(rest.indexOf('?')) : '') : '/' + rest.slice(slashIndex);
    const project = hostname.replace('cluster0.', '').replace('.mongodb.net', '');
    return { creds, hostname, project, pathAndQuery };
}

function buildSeedList(project) {
    return [
        `ac-${project}-shard-00-00.${project}.mongodb.net:27017`,
        `ac-${project}-shard-00-01.${project}.mongodb.net:27017`,
        `ac-${project}-shard-00-02.${project}.mongodb.net:27017`,
    ].join(',');
}

function resolveSrvViaNslookup(hostname) {
    return new Promise((resolve, reject) => {
        exec(`nslookup -type=SRV _mongodb._tcp.${hostname}`, (err, stdout) => {
            if (err) return reject(err);
            const hosts = [];
            for (const line of stdout.split('\n')) {
                const m = line.match(/svr hostname\s*=\s*(\S+)/i);
                if (m) hosts.push(m[1] + ':27017');
            }
            hosts.length ? resolve(hosts) : reject(new Error('No SRV records from nslookup'));
        });
    });
}

exports.connectDB = async (url) => {
    let dbUrl = url;
    if (!dbUrl) {
        console.error("❌ DB_URL is not defined");
        process.exit(1);
    }

    if (isSrvUrl(dbUrl)) {
        const parsed = parseSrvUrl(dbUrl);

        // Check if Node.js can resolve SRV natively
        let srvOk = false;
        try {
            await dns.promises.resolveSrv(`_mongodb._tcp.${parsed.hostname}`);
            srvOk = true;
        } catch { }

            if (!srvOk) {
            console.warn('⚠️  Node.js DNS SRV failed — trying system nslookup...');

            let seedHosts = null;
            try {
                const hosts = await resolveSrvViaNslookup(parsed.hostname);
                seedHosts = hosts.join(',');
                console.log('↪  Resolved ' + hosts.length + ' shard hosts via nslookup');
            } catch {
                const directUrl = dbUrl.replace('mongodb+srv://', 'mongodb://');
                const sep = directUrl.includes('?') ? '&' : '?';
                dbUrl = directUrl + sep + 'ssl=true&directConnection=true';
                console.log('↪  Falling back to direct connection...');
            }

            if (seedHosts) {
                const base = `mongodb://${parsed.creds}@${seedHosts}${parsed.pathAndQuery}`;
                const separator = base.includes('?') ? '&' : '?';
                dbUrl = base + separator + 'ssl=true&replicaSet=atlas-' + parsed.project;
                console.log('↪  Retrying with shard hosts...');
            }
        }
    }

    try {
        const conn = await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 15000,
            maxPoolSize: 50,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            waitQueueTimeoutMS: 5000,
        });
        console.log(`✅ Database connected on ${conn.connection.host} (pool: ${conn.connection.client?.options?.maxPoolSize || 50})`);
    } catch (error) {
        console.error('❌ Database not connected:', error.message);
        console.error('');
        console.error('💡  MongoDB connection failed. The server is reachable but Atlas is');
        console.error('    blocking your IP. Go to MongoDB Atlas → Network Access and add');
        console.error('    your current IP address (or use 0.0.0.0/0 for dev).');
        console.error('');
        process.exit(1);
    }
};

exports.disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error during disconnection:", error.message);
    }
};
