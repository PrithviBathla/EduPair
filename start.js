import { spawn } from 'child_process';

// Set environment variables
process.env.SESSION_SECRET = 'edupair_secret_key';
process.env.NODE_ENV = 'development';

// Start the server
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log();
});
