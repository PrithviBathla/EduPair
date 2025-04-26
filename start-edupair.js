// This script starts the EduPair application
process.env.SESSION_SECRET = 'edupair_secret_key';
process.env.NODE_ENV = 'development';

// Run the npm dev script
import { spawn } from 'child_process';
spawn('npm', ['run', 'dev'], { stdio: 'inherit' });