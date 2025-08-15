const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// MIME type mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    return mimeTypes[extname] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
    // Parse URL and get file path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Security: Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    
    // Check if file exists
    fs.access(safePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 - Not Found</title></head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <code>${req.url}</code> was not found.</p>
                        <p><a href="/">Back to E-ink Dashboard</a></p>
                    </body>
                </html>
            `);
            return;
        }

        // Read and serve file
        fs.readFile(safePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 - Server Error</title></head>
                        <body>
                            <h1>500 - Internal Server Error</h1>
                            <p>Error reading file: ${err.message}</p>
                        </body>
                    </html>
                `);
                return;
            }

            // Set appropriate content type
            const mimeType = getMimeType(safePath);
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'  // Prevent caching for development
            });
            res.end(content);
        });
    });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // Listen on all interfaces

server.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    console.log('🖥️  E-ink Browser Testing Dashboard Server Started');
    console.log('========================================');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Local access: http://localhost:${PORT}`);
    console.log(`📱 Network access: http://${localIP}:${PORT}`);
    console.log('========================================');
    console.log('📋 Available endpoints:');
    console.log(`   • Dashboard: http://${localIP}:${PORT}/`);
    console.log(`   • Styles: http://${localIP}:${PORT}/style.css`);
    console.log(`   • Scripts: http://${localIP}:${PORT}/script.js`);
    console.log(`   • README: http://${localIP}:${PORT}/README.md`);
    console.log('========================================');
    console.log('💡 Use the network address to access from your e-ink tablet');
    console.log('⏹️  Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use`);
        console.log('💡 Try a different port: PORT=3001 node server.js');
    } else {
        console.error('❌ Server error:', err.message);
    }
    process.exit(1);
});