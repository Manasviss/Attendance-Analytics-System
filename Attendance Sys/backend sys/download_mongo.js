const { MongoBinary } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

async function download() {
    console.log('Downloading MongoDB binary...');
    // Ensure directory exists
    const binDir = path.join(__dirname, 'mongobin');
    if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir);
    }

    // Force download to specific path
    const binaryPath = await MongoBinary.getPath({
        version: '7.0.8', // Fixed version for stability
        downloadDir: binDir
    });

    console.log(`MongoDB downloaded to: ${binaryPath}`);

    // rename to mongod.exe if it has a complex name, but typically it keeps it
    // We will inspect the folder after running this.
}

download().catch(err => {
    console.error(err);
    process.exit(1);
});
