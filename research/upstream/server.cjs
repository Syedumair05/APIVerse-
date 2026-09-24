const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 6000;

const datasetPath = path.join(
    __dirname,
    '../../backend/src/data/countriesData.json'
);

let countries;

try {
    countries = JSON.parse(
        fs.readFileSync(datasetPath, 'utf8')
    );

    if (!Array.isArray(countries) || countries.length === 0) {
        throw new Error('Country dataset is empty or invalid.');
    }

    console.log(`Loaded dataset: ${countries.length} countries`);
} catch (error) {
    console.error('Failed to load country dataset:', error);
    process.exit(1);
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(
        req.url || '/',
        `http://127.0.0.1:${PORT}`
    );

    const pathname = requestUrl.pathname;

    console.log(`[UPSTREAM] ${req.method} ${req.url}`);

    // APIVerse currently requests the country list from /all
    // or may request the root path depending on configuration.
    const isCountryEndpoint =
        req.method === 'GET' &&
        (
            pathname === '/' ||
            pathname === '/all' ||
            pathname === '/countries/v5' ||
            pathname === '/countries/v5/all'
        );

    if (isCountryEndpoint) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
        });

        // IMPORTANT:
        // Return the ORIGINAL APIVerse country structure.
        // Do NOT convert it to the v5 format.
        res.end(JSON.stringify(countries));
        return;
    }

    if (req.method === 'GET' && pathname === '/health') {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
        });

        res.end(JSON.stringify({
            success: true,
            status: 'healthy',
            datasetSize: countries.length,
        }));

        return;
    }

    res.writeHead(404, {
        'Content-Type': 'application/json; charset=utf-8',
    });

    res.end(JSON.stringify({
        success: false,
        message: 'Not Found',
        requestedPath: pathname,
    }));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(
        `Controlled upstream API running at http://127.0.0.1:${PORT}`
    );
    console.log(`Dataset size: ${countries.length} countries`);
});

server.on('error', (error) => {
    console.error('[UPSTREAM] Server error:', error);
});