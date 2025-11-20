const playwright = require('playwright');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

// Configuration
const config = {
  htmlFile: path.join(__dirname, 'animated-eye.html'),
  outputDir: path.join(__dirname, 'frames'),
  outputVideo: path.join(__dirname, 'animated-eye.mp4'),
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 4, // seconds (one full animation cycle)
};

async function captureFrames() {
  console.log('Starting frame capture...');

  // Create output directory
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
  }

  // Launch browser
  console.log('Launching browser...');
  const browser = await playwright.chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Load HTML file
  console.log('Loading HTML file...');
  await page.goto(`file://${config.htmlFile}`);

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(100); // Extra time for animations to initialize

  const totalFrames = config.duration * config.fps;
  const frameInterval = 1000 / config.fps; // milliseconds per frame

  console.log(`Capturing ${totalFrames} frames at ${config.fps} fps...`);

  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(config.outputDir, `frame-${String(i).padStart(5, '0')}.png`);

    // Capture screenshot
    await page.screenshot({ path: framePath, fullPage: false });

    // Wait for next frame
    if (i < totalFrames - 1) {
      await page.waitForTimeout(frameInterval);
    }

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === totalFrames - 1) {
      console.log(`Captured ${i + 1}/${totalFrames} frames`);
    }
  }

  await browser.close();
  console.log('Frame capture complete!');
}

async function convertToMP4() {
  console.log('Converting frames to MP4...');

  const inputPattern = path.join(config.outputDir, 'frame-%05d.png');
  const ffmpegCommand = `"${ffmpegPath}" -framerate ${config.fps} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 "${config.outputVideo}" -y`;

  console.log('Running ffmpeg...');

  try {
    const { stdout, stderr } = await execPromise(ffmpegCommand);
    console.log('FFmpeg output:', stderr); // ffmpeg outputs to stderr
    console.log(`Video created successfully: ${config.outputVideo}`);
  } catch (error) {
    console.error('FFmpeg error:', error);
    throw error;
  }
}

async function cleanupFrames() {
  console.log('Cleaning up frames...');

  const files = fs.readdirSync(config.outputDir);
  for (const file of files) {
    fs.unlinkSync(path.join(config.outputDir, file));
  }
  fs.rmdirSync(config.outputDir);

  console.log('Cleanup complete!');
}

async function main() {
  try {
    console.log('=== HTML to MP4 Converter ===');
    console.log(`Input: ${config.htmlFile}`);
    console.log(`Output: ${config.outputVideo}`);
    console.log(`Resolution: ${config.width}x${config.height}`);
    console.log(`Duration: ${config.duration}s @ ${config.fps} fps`);
    console.log('');

    await captureFrames();
    await convertToMP4();
    await cleanupFrames();

    console.log('');
    console.log('=== Conversion Complete! ===');
    console.log(`Your video is ready: ${config.outputVideo}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
