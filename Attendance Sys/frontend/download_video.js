import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pexels video: "Students Walking in Campus" (Diverse/Indian look)
// Using a direct link to a Pexels video file (HD)
const url = "https://videos.pexels.com/video-files/7971249/7971249-hd_1920_1080_25fps.mp4";
const dest = path.join(__dirname, 'public', 'videos', 'university.mp4');

// Ensure directory exists
const dir = path.dirname(dest);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };

    const request = https.get(url, options, function (response) {
        // Handle redirect
        if (response.statusCode === 301 || response.statusCode === 302) {
            console.log('Redirecting to:', response.headers.location);
            file.close();
            fs.unlinkSync(dest); // Delete partial file
            return download(response.headers.location, dest);
        }

        if (response.statusCode !== 200) {
            console.error(`Failed to download: ${response.statusCode}`);
            file.close();
            fs.unlinkSync(dest);
            return;
        }

        response.pipe(file);
        file.on('finish', function () {
            file.close(() => console.log('Download completed'));
        });
    }).on('error', function (err) {
        fs.unlink(dest);
        console.error('Error downloading:', err.message);
    });
};

download(url, dest);
