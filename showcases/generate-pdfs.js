const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

const files = [
  { html: 'showcase-borneo-esg.html', pdf: 'showcase-borneo-esg.pdf' },
  { html: 'showcase-ctap.html', pdf: 'showcase-ctap.pdf' },
  { html: 'showcase-catering.html', pdf: 'showcase-catering.pdf' },
  { html: 'showcase-runkitakrun.html', pdf: 'showcase-runkitakrun.pdf' },
  { html: 'showcase-ukas-tiktok.html', pdf: 'showcase-ukas-tiktok.pdf' },
];

const dir = path.join(__dirname);

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const f of files) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 900, height: 1270 });
    await page.goto('file://' + path.join(dir, f.html), { waitUntil: 'networkidle' });
    // Wait for fonts to load
    await page.waitForTimeout(1500);
    await page.pdf({
      path: path.join(dir, f.pdf),
      width: '900px',
      height: '1270px',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    console.log('Generated:', f.pdf);
    await page.close();
  }

  await browser.close();
  console.log('All PDFs done.');
})();
