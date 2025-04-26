import { spawn } from 'child_process';
import { exec } from 'child_process';

// Set environment variables
process.env.SESSION_SECRET = 'edupair_secret_key';
process.env.NODE_ENV = 'development';

console.log('Setting up the database...');
// Run database migration
exec('npm run db:push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Database migration error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Database migration stderr: ${stderr}`);
  }
  console.log(`${stdout}`);
  console.log('Database setup complete.');
  
  console.log('Starting the EduPair server...');
  // Start the server
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: process.env
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
});
