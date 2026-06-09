const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const sites = [
  {
    name: 'runkitakrun',
    url: 'https://runkitakrun.netlify.app/',
    extras: [
      { label: 'events', url: 'https://runkitakrun.netlify.app/events' },
      { label: 'community', url: 'https://runkitakrun.netlify.app/community' },
      { label: 'iban', url: 'https://runkitakrun.netlify.app/?lang=iban' },
      { label: 'chinese', url: 'https://runkitakrun.netlify.app/?lang=zh' },
    ]
  },
  {
    name: 'ctap',
    url: 'https://ctap-kobis.netlify.app/',
    extras: [
      { label: 'calculators', url: 'https://ctap-kobis.netlify.app/calculators' },
      { label: 'dashboard', url: 'https://ctap-kobis.netlify.app/dashboard' },
      { label: 'solutions', url: 'https://ctap-kobis.netlify.app/solutions' },
    ]
  },
  {
    name: 'catering',
    url: 'https://kuching-catering-co.netlify.app/',
    extras: [
      { label: 'quote', url: 'https://kuching-catering-co.netlify.app/quote' },
      { label: 'services', url: 'https://kuching-catering-co.netlify.app/services' },
      { label: 'gallery', url: 'https://kuching-catering-co.netlify.app/gallery' },
      { label: 'chinese', url: 'https://kuching-catering-co.netlify.app/?lang=zh' },
    ]
  },
  {
    name: 'esg',
    url: 'https://borneoesgforum2026.netlify.app/',
    extras: [
      { label: 'programme', url: 'https://borneoesgforum2026.netlify.app/programme' },
      { label: 'register', url: 'https://borneoesgforum2026.netlify.app/register' },
      { label: 'speakers', url: 'https://borneoesgforum2026.netlify.app/speakers' },
    ]
  },
  {
    name: 'ukas',
    url: 'https://ukasttc.uk/',
    extras: [
      { label: 'register', url: 'https://ukasttc.uk/register' },
      { label: 'iban', url: 'https://ukasttc.uk/?lang=iban' },
      { label: 'admin', url: 'https://ukasttc.uk/admin' },
      { label: 'categories', url: 'https://ukasttc.uk/categories' },
    ]
  },
];

async function shot(page, url, file, viewport = { width: 1440, height: 900 }) {
  try {
    await page.setViewportSize(viewport);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: file, fullPage: false });
    console.log('✓', file);
  } catch (e) {
    console.log('✗', url, e.message.slice(0, 80));
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
  });

  for (const site of sites) {
    const page = await browser.newPage();
    // desktop
    await shot(page, site.url, path.join(outDir, `${site.name}-desktop.png`), { width: 1440, height: 900 });
    // mobile
    await shot(page, site.url, path.join(outDir, `${site.name}-mobile.png`), { width: 390, height: 844 });
    // tablet
    await shot(page, site.url, path.join(outDir, `${site.name}-tablet.png`), { width: 768, height: 1024 });
    // extras
    for (const extra of site.extras || []) {
      await shot(page, extra.url, path.join(outDir, `${site.name}-${extra.label}.png`), { width: 1440, height: 900 });
    }
    await page.close();
  }

  await browser.close();
  console.log('\nDone. Screenshots in:', outDir);
})();
