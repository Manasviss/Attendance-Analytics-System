const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const frontendDir = path.join(__dirname, 'frontend');
const backendDir = path.join(__dirname, 'backend sys');
const frontendDist = path.join(frontendDir, 'dist');
const backendDist = path.join(backendDir, 'dist');

console.log('--- Starting Build Process ---');

// 1. Copy Frontend Build to Backend
console.log('Copying frontend build to backend...');
if (fs.existsSync(backendDist)) {
    console.log('Removing old backend dist...');
    fs.rmSync(backendDist, { recursive: true, force: true });
}

// Simple recursive copy function since fs.cp is widely available in Node 16+ but let's be safe
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

try {
    copyFolderSync(frontendDist, backendDist);
    console.log('Frontend build copied successfully.');
} catch (err) {
    console.error('Error copying frontend build:', err);
    process.exit(1);
}

// 2. Run pkg
console.log('Running pkg to generate executable...');
try {
    // Run npx pkg . --out-path ..
    // We run inside backend directory so it picks up package.json config
    execSync('npx pkg . --output ../attendance.exe', { cwd: backendDir, stdio: 'inherit' });
    console.log('Executable created successfully at attendance.exe');
} catch (err) {
    console.error('Error running pkg:', err);
    process.exit(1);
}

console.log('--- Build Complete ---');
