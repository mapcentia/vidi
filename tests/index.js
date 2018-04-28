const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox']});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('https://googlechrome.github.io/samples/service-worker/custom-offline-page/', { waitUntil: 'networkidle0' });
  console.log('Before reload');
  console.log('Setting app offline');
  await page.setOfflineMode(true);
  await page.waitFor(1*2000);
  await page.reload();
  await page.waitFor(1*2000);
  console.log('Before screenshot');
  await page.screenshot({path: 'public/vidi.png'});


  /*
  await page.goto('https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/12/39.3983/-6.886/', { waitUntil: 'networkidle0' });
  await page.waitFor(1*4000);
  console.log('Before reload');
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('After reload');
  await page.waitFor(1*4000);
  console.log('Setting app offline');
  await page.setOfflineMode(true);
  await page.waitFor(1*8000);
  console.log('Setting app online');
  await page.setOfflineMode(false);
  await page.waitFor(1*8000);
  await page.screenshot({path: 'public/vidi.png'});

  await browser.close();
  */



  
})();