const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('https://googlechrome.github.io/samples/service-worker/custom-offline-page/', { waitUntil: 'networkidle0' });
  console.log('Before reload');
  console.log('Setting app offline');
  await page.setOfflineMode(true);
  await page.waitFor(1 * 2000);
  await page.reload();
  await page.waitFor(1 * 2000);
  console.log('Before screenshot');
  await page.screenshot({ path: 'public/vidi.png' });
})();