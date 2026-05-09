const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORTS = [3000, 3001, 3002];

function run(command) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
  } catch {
    return '';
  }
}

function killPortsWindows() {
  const output = run('netstat -ano -p tcp');
  if (!output) return;

  const pids = new Set();
  const lines = output.split(/\r?\n/);

  for (const line of lines) {
    const normalized = line.trim().replace(/\s+/g, ' ');
    if (!normalized.startsWith('TCP')) continue;

    const parts = normalized.split(' ');
    const local = parts[1] || '';
    const pid = parts[4] || '';

    for (const port of PORTS) {
      if (local.endsWith(`:${port}`) && pid) {
        pids.add(pid);
      }
    }
  }

  for (const pid of pids) {
    run(`taskkill /PID ${pid} /F`);
  }
}

function killPortsUnix() {
  for (const port of PORTS) {
    const pids = run(`lsof -ti tcp:${port}`).trim().split(/\s+/).filter(Boolean);
    for (const pid of pids) {
      run(`kill -9 ${pid}`);
    }
  }
}

function removeNextDirs() {
  const buildDirs = ['.next', '.next-dev'];
  for (const dir of buildDirs) {
    fs.rmSync(path.join(process.cwd(), dir), { recursive: true, force: true });
  }
}

function startDevServer() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  // Use shell: true for better cross-platform compatibility
  const child = spawn(npmCmd, ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NEXT_DIST_DIR: process.env.NEXT_DIST_DIR || '.next-dev',
    },
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

function main() {
  if (process.platform === 'win32') {
    killPortsWindows();
  } else {
    killPortsUnix();
  }

  removeNextDirs();
  startDevServer();
}

main();
