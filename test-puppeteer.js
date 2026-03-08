const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching visible browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.goto('https://google.com');
  
  console.log('Browser open. You can interact with it.');
  console.log('Close the terminal or the browser window to stop.');
})();
