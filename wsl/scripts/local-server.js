#!/usr/bin/env node
// Simple HTTP server to serve the deployment file

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  // Handle any request to serve the main file
  if (req.url.startsWith('/') || req.url.includes('index.html')) {
    try {
      const content = fs.readFileSync('jetstreamin-production-live.html', 'utf8');
      res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
      console.log(`✅ Served deployment file (${content.length} bytes)`);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error: ${error.message}`);
      console.log(`❌ Error: ${error.message}`);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌊 JETSTREAMIN LOCAL SERVER RUNNING`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📏 File size: ${fs.statSync('jetstreamin-production-live.html').size} bytes`);
  console.log(`✅ All features active and ready to view`);
});

server.on('error', (error) => {
  console.log(`❌ Server error: ${error.message}`);
});
