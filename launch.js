import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const rootDir = process.cwd();
const platform = process.platform; // 'win32', 'linux', or 'darwin'

let osName = 'linux';
if (platform === 'win32') osName = 'win';
else if (platform === 'darwin') osName = 'mac';

const targetFolder = `node_modules_${osName}`;
const targetPath = path.join(rootDir, targetFolder);
const nodeModulesPath = path.join(rootDir, 'node_modules');

console.log(`\n==================================================`);
console.log(` 🚀 Dual-OS Auto Launcher (${platform.toUpperCase()})`);
console.log(`==================================================\n`);

// 1. Ensure target OS node_modules folder exists
if (!fs.existsSync(targetPath)) {
  console.log(`📁 Creating OS-specific module directory: ${targetFolder}`);
  fs.mkdirSync(targetPath, { recursive: true });
}

// 2. Handle node_modules symlink/junction swap
let needNewLink = true;

if (fs.existsSync(nodeModulesPath) || fs.existsSync(nodeModulesPath) === false) {
  try {
    const stat = fs.lstatSync(nodeModulesPath);
    if (stat.isSymbolicLink()) {
      const currentLink = fs.readlinkSync(nodeModulesPath);
      if (currentLink === targetFolder || currentLink === targetPath) {
        needNewLink = false;
      } else {
        console.log(`🔄 Swapping node_modules link from (${currentLink}) to (${targetFolder})...`);
        fs.unlinkSync(nodeModulesPath);
      }
    } else if (stat.isDirectory()) {
      // If node_modules is a real folder from an old single-OS install, rename or remove it
      console.log(`📁 Converting standard node_modules directory to platform link...`);
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    }
  } catch (err) {
    // Stat error or missing link
  }
}

if (needNewLink) {
  try {
    const linkType = platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(targetFolder, 'node_modules', linkType);
    console.log(`✅ Linked ./node_modules ➔ ./${targetFolder}`);
  } catch (err) {
    console.error(`❌ Failed to create symlink/junction:`, err.message);
    console.log(`💡 Note: On Windows, you may need to run PowerShell/CMD as Administrator or enable Developer Mode for symlinks.`);
  }
}

// 3. Check if dependencies are installed in target OS folder
const hasExpress = fs.existsSync(path.join(nodeModulesPath, 'express'));
if (!hasExpress) {
  console.log(`\n📦 Dependencies missing for ${osName.toUpperCase()}. Running 'npm install'...\n`);
  const installRes = spawnSync('npm', ['install'], { stdio: 'inherit', shell: true });
  if (installRes.status !== 0) {
    console.error(`❌ 'npm install' failed. Please check your internet connection.`);
    process.exit(1);
  }
}

// 4. Launch Application
console.log(`\n✨ Starting Legal Hub Server...\n`);
const devServer = spawnSync('npx', ['tsx', 'server.ts'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});
process.exit(devServer.status || 0);
