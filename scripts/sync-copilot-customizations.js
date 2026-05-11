#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const os = require('os');

function parseArgs(argv) {
  const args = { mode: 'profile-to-local', dryRun: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (token === '--mode') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --mode');
      }
      args.mode = value;
      i += 1;
      continue;
    }

    if (token.startsWith('--mode=')) {
      args.mode = token.split('=')[1];
      continue;
    }
  }

  if (!['profile-to-local', 'local-to-profile', 'two-way'].includes(args.mode)) {
    throw new Error(`Invalid mode: ${args.mode}`);
  }

  return args;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function getFileStat(filePath) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

async function listFiles(rootDir, allowedSuffix) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(allowedSuffix))
    .map((entry) => entry.name);
}

async function copyIfNewer(src, dst, dryRun) {
  const srcStat = await getFileStat(src);
  const dstStat = await getFileStat(dst);

  if (!srcStat) {
    return { copied: false, reason: 'missing-source' };
  }

  const shouldCopy = !dstStat || srcStat.mtimeMs > dstStat.mtimeMs + 1;
  if (!shouldCopy) {
    return { copied: false, reason: 'up-to-date' };
  }

  if (!dryRun) {
    await ensureDir(path.dirname(dst));
    await fs.copyFile(src, dst);
    await fs.utimes(dst, srcStat.atime, srcStat.mtime);
  }

  return { copied: true, reason: dstStat ? 'updated' : 'created' };
}

async function syncFileGroup({ fromDir, toDir, suffix, dryRun }) {
  const result = { checked: 0, copied: 0 };

  if (!(await pathExists(fromDir))) {
    return result;
  }

  await ensureDir(toDir);
  const files = await listFiles(fromDir, suffix);

  for (const fileName of files) {
    result.checked += 1;
    const src = path.join(fromDir, fileName);
    const dst = path.join(toDir, fileName);
    const copied = await copyIfNewer(src, dst, dryRun);
    if (copied.copied) {
      result.copied += 1;
    }
  }

  return result;
}

async function listSkillFolders(rootDir) {
  if (!(await pathExists(rootDir))) {
    return [];
  }

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const folders = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillDir = path.join(rootDir, entry.name);
    const skillFile = path.join(skillDir, 'SKILL.md');
    if (await pathExists(skillFile)) {
      folders.push(entry.name);
    }
  }

  return folders;
}

async function listAllFilesRecursive(rootDir, baseDir = rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listAllFilesRecursive(fullPath, baseDir);
      files = files.concat(nested);
    } else if (entry.isFile()) {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

async function syncSkillFolders({ fromDir, toDir, dryRun }) {
  const result = { checked: 0, copied: 0 };
  const folders = await listSkillFolders(fromDir);

  for (const folderName of folders) {
    const srcFolder = path.join(fromDir, folderName);
    const dstFolder = path.join(toDir, folderName);

    await ensureDir(dstFolder);
    const files = await listAllFilesRecursive(srcFolder);

    for (const relativeFile of files) {
      result.checked += 1;
      const src = path.join(srcFolder, relativeFile);
      const dst = path.join(dstFolder, relativeFile);
      const copied = await copyIfNewer(src, dst, dryRun);
      if (copied.copied) {
        result.copied += 1;
      }
    }
  }

  return result;
}

async function runOneDirection({ fromProfile, toProfile, modeLabel, dryRun, profileRoot, profileSkillsRoot, localRoot }) {
  const sourceRoot = fromProfile ? profileRoot : localRoot;
  const targetRoot = fromProfile ? localRoot : profileRoot;
  const sourceSkills = fromProfile ? profileSkillsRoot : path.join(localRoot, 'skills');
  const targetSkills = fromProfile ? path.join(localRoot, 'skills') : profileSkillsRoot;

  const mappings = [
    {
      name: 'agents',
      suffix: '.agent.md',
      fromDir: path.join(sourceRoot, 'agents'),
      toDir: path.join(targetRoot, 'agents'),
    },
    {
      name: 'prompts',
      suffix: '.prompt.md',
      fromDir: path.join(sourceRoot, 'prompts'),
      toDir: path.join(targetRoot, 'prompts'),
    },
    {
      name: 'instructions',
      suffix: '.instructions.md',
      fromDir: path.join(sourceRoot, 'instructions'),
      toDir: path.join(targetRoot, 'instructions'),
    },
  ];

  console.log(`\n== ${modeLabel} ==`);
  let totalChecked = 0;
  let totalCopied = 0;

  for (const mapping of mappings) {
    const summary = await syncFileGroup({
      fromDir: mapping.fromDir,
      toDir: mapping.toDir,
      suffix: mapping.suffix,
      dryRun,
    });

    totalChecked += summary.checked;
    totalCopied += summary.copied;

    console.log(`${mapping.name}: checked=${summary.checked}, copied=${summary.copied}`);
  }

  const skillsSummary = await syncSkillFolders({
    fromDir: sourceSkills,
    toDir: targetSkills,
    dryRun,
  });

  totalChecked += skillsSummary.checked;
  totalCopied += skillsSummary.copied;

  console.log(`skills: checked=${skillsSummary.checked}, copied=${skillsSummary.copied}`);
  console.log(`total: checked=${totalChecked}, copied=${totalCopied}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const profileRoot = path.join(appData, 'Code', 'User');
  const profileSkillsRoot = path.join(os.homedir(), '.copilot', 'skills');
  const localRoot = path.join(process.cwd(), '.github');

  await ensureDir(localRoot);

  if (args.mode === 'profile-to-local') {
    await runOneDirection({
      fromProfile: true,
      modeLabel: 'PROFILE -> LOCAL',
      dryRun: args.dryRun,
      profileRoot,
      profileSkillsRoot,
      localRoot,
    });
    return;
  }

  if (args.mode === 'local-to-profile') {
    await runOneDirection({
      fromProfile: false,
      modeLabel: 'LOCAL -> PROFILE',
      dryRun: args.dryRun,
      profileRoot,
      profileSkillsRoot,
      localRoot,
    });
    return;
  }

  await runOneDirection({
    fromProfile: true,
    modeLabel: 'PROFILE -> LOCAL',
    dryRun: args.dryRun,
    profileRoot,
    profileSkillsRoot,
    localRoot,
  });

  await runOneDirection({
    fromProfile: false,
    modeLabel: 'LOCAL -> PROFILE',
    dryRun: args.dryRun,
    profileRoot,
    profileSkillsRoot,
    localRoot,
  });
}

main().catch((error) => {
  console.error(`sync failed: ${error.message}`);
  process.exit(1);
});


