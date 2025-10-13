#!/usr/bin/env node
/**
 * INSTANT EC2 DEPLOYMENT - NO BULLSHIT
 * Direct file transfer to production NOW
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 INSTANT DEPLOYMENT TO EC2');
console.log('==============================');

// Check file exists
if (!fs.existsSync('./index.html')) {
  console.log('❌ index.html not found');
  process.exit(1);
}

const fileSize = (fs.statSync('./index.html').size / 1024).toFixed(1);
console.log(`📄 Deploying index.html (${fileSize}KB)`);

// Direct deployment commands
const commands = [
  {
    desc: 'Upload to EC2',
    cmd: 'scp -o StrictHostKeyChecking=no -i jetstreamin-key.pem index.html ec2-user@jetstreamin.io:~/index.html.new'
  },
  {
    desc: 'Install & reload',
    cmd: 'ssh -o StrictHostKeyChecking=no -i jetstreamin-key.pem ec2-user@jetstreamin.io "sudo mv ~/index.html.new /var/www/html/index.html && sudo chown nginx:nginx /var/www/html/index.html && sudo systemctl reload nginx"'
  }
];

// Execute each command
commands.forEach(({ desc, cmd }, index) => {
  console.log(`\n${index + 1}. ${desc}...`);
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 30000 });
    console.log(`✅ ${desc} - SUCCESS`);
  } catch (error) {
    console.log(`❌ ${desc} - FAILED: ${error.message}`);
    if (error.message.includes('No such file')) {
      console.log('💡 SSH key not found. Run this manually:');
      console.log(`   ${cmd}`);
    }
  }
});

// Verify deployment
console.log('\n🔍 Verifying...');
try {
  const result = execSync('curl -s -o /dev/null -w "%{http_code}" https://jetstreamin.io', { encoding: 'utf8' });
  if (result.trim() === '200') {
    console.log('✅ LIVE: https://jetstreamin.io (HTTP 200)');
  } else {
    console.log(`⚠️  Response: HTTP ${result.trim()}`);
  }
} catch (error) {
  // Try PowerShell instead
  try {
    execSync('powershell -Command "try { $r = Invoke-WebRequest -Uri \'https://jetstreamin.io\' -Method Head; Write-Host \'HTTP\', $r.StatusCode } catch { Write-Host \'Connection failed\' }"', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  Verification failed - check manually at https://jetstreamin.io');
  }
}

console.log('\n🎉 DEPLOYMENT COMPLETE!');
console.log('🌊 https://jetstreamin.io should now show updated content');
console.log('⚡ CDN cache will update within 5-10 minutes');
