/**
 * Helper script to restart the development server
 * Run this with: node restart-dev.js
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Stopping any existing Vite processes...');

// First try to kill any existing dev processes
const killProcess = spawn('powershell', [
  'Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force'
], {
  shell: true,
  stdio: 'inherit'
});

killProcess.on('close', (code) => {
  console.log(`✅ Cleaned up previous processes with exit code ${code}`);
  console.log('🚀 Starting development server with new configuration...');

  // Start the development server
  const startProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname),
    shell: true,
    stdio: 'inherit'
  });

  startProcess.on('close', (code) => {
    console.log(`Development server exited with code ${code}`);
  });
});
