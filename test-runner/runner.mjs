import http from "http";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const rootDir = process.env.ROOT_DIR || path.resolve("/game");
const browserEditionDir = path.join(rootDir, "browser-edition");
const artifactsDir = process.env.ARTIFACTS_DIR || path.resolve("/artifacts");

// Simple static file server for browser-edition
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(browserEditionDir, req.url === "/" ? "index.html" : req.url);
  
  // Security check against path traversal
  if (!filePath.startsWith(browserEditionDir)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || stats.isDirectory()) {
      filePath = path.join(browserEditionDir, "index.html");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Not Found");
        return;
      }
      const ext = path.extname(filePath);
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.end(data);
    });
  });
});

const PORT = 4173;
server.listen(PORT, async () => {
  console.log(`Static server running at http://127.0.0.1:${PORT}`);
  try {
    await runWorkflow();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error("Workflow failed:", err);
    server.close();
    process.exit(1);
  }
});

async function runWorkflow() {
  const galleryDir = path.join(artifactsDir, "gallery");
  fs.mkdirSync(galleryDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: artifactsDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  const startTime = Date.now();

  console.log("Navigating to app...");
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });

  // 1. Wait for .mission-card on Home Screen (1800ms)
  await page.waitForSelector(".mission-card", { timeout: 10000 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(galleryDir, "01-mission-queue.png") });

  // 2. Click the first unlocked .mission-card:not(.locked)
  const missionCard = page.locator(".mission-card:not(.locked)").first();
  await missionCard.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(galleryDir, "02-operation-start-scan-mode.png") });

  // 3. In SCAN mode (default), click 4-5 tactical sectors
  const sectors = page.locator(".tactical-grid .sector");
  const sectorIndices = [0, 6, 12, 18, 24];
  for (const idx of sectorIndices) {
    const count = await sectors.count();
    if (idx < count) {
      await sectors.nth(idx).click().catch(() => {});
      await page.waitForTimeout(900);
    }
  }
  await page.screenshot({ path: path.join(galleryDir, "03-scanning-sectors.png") });

  // 4. Click MARK button (.action-dock button nth(2)) and mark a sector
  const actionButtons = page.locator(".action-dock button");
  if ((await actionButtons.count()) >= 3) {
    await actionButtons.nth(2).click().catch(() => {});
  }
  await page.waitForTimeout(600);
  if ((await sectors.count()) > 1) {
    await sectors.nth(1).click().catch(() => {});
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(galleryDir, "04-marking-threats.png") });

  // 5. Click CLEAR button (nth(1)) and click several safe sectors
  if ((await actionButtons.count()) >= 2) {
    await actionButtons.nth(1).click().catch(() => {});
  }
  await page.waitForTimeout(600);
  for (let i = 2; i < 8; i++) {
    const count = await sectors.count();
    if (i < count) {
      await sectors.nth(i).click().catch(() => {});
      await page.waitForTimeout(900);
    }
  }
  await page.screenshot({ path: path.join(galleryDir, "05-clearing-grid.png") });

  // 6. Check for results screen or click back button
  const resultsScreen = page.locator(".results-screen");
  const hasResults = await resultsScreen.isVisible().catch(() => false);
  if (!hasResults) {
    const backBtn = page.locator(".back-button").first();
    await backBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(galleryDir, "06-operation-results.png") });

  // 7. Pad to ~30.5s total
  const elapsed = Date.now() - startTime;
  const targetDuration = 30500;
  if (elapsed < targetDuration) {
    await page.waitForTimeout(targetDuration - elapsed);
  }

  await context.close();
  await browser.close();

  // Rename recorded video to demo.webm if exists
  const files = fs.readdirSync(artifactsDir);
  const videoFile = files.find(f => f.endsWith(".webm"));
  if (videoFile) {
    fs.renameSync(path.join(artifactsDir, videoFile), path.join(artifactsDir, "demo.webm"));
    console.log("Saved video as demo.webm");
  }
}
