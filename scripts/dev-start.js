const { spawn } = require('child_process');
const path = require('path');

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const args = ['dev', ...process.argv.slice(2)];

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_DIST_DIR: process.env.NEXT_DIST_DIR || '.next-dev',
  },
});

child.on('exit', (code) => {
  process.exit(code || 0);
});


