export default {
  name: 'Start EduPair',
  description: 'Start the EduPair application server',
  run: async () => {
    const { spawn } = await import('child_process');
    
    process.env.SESSION_SECRET = 'edupair_secret_key';
    process.env.NODE_ENV = 'development';
    
    const proc = spawn('./start-app', [], {
      stdio: 'inherit',
      env: process.env,
      shell: true
    });
    
    return new Promise((resolve) => {
      proc.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
        resolve();
      });
    });
  }
};