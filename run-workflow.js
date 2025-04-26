// This script handles the startup process for the EduPair application
import { spawn } from 'node:child_process';

// Create a child process for the server
console.log('Starting EduPair server...');

// Set environment variables
process.env.SESSION_SECRET = 'edupair_secret_key';
process.env.NODE_ENV = 'development';

// Start the node.js server with npm run dev
const proc = spawn('npm', ['run', 'dev'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  env: process.env
});

// Handle process events
proc.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Prevent script from exiting
process.stdin.resume();