// This is a workflow configuration file for Replit
import { spawn } from 'child_process';

export default {
  name: 'Start application',
  description: 'Runs the EduPair application server',
  run: async () => {
    process.env.SESSION_SECRET = 'edupair_secret_key';
    process.env.NODE_ENV = 'development';
    
    const proc = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: process.env
    });
    
    // Keep the workflow running
    return new Promise((resolve) => {
      proc.on('exit', (code) => {
        console.log(`Server exited with code ${code}`);
        resolve();
      });
    });
  }
};