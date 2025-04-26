// Simple start script for Replit
import { spawn } from 'child_process';

console.log('🚀 Starting EduPair application...');

// Set necessary environment variables
process.env.SESSION_SECRET = 'edupair_secret_key';
process.env.NODE_ENV = 'development';

// Start the application using npm run dev
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: process.env
});

// Handle server process events
server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('👋 Shutting down EduPair application...');
  server.kill('SIGINT');
  process.exit(0);
});