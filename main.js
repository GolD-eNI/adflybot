const {Builder, Capabilities, By, Key, ChromeOptions, Chrome} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const proxy = require('selenium-webdriver/proxy');

const randomUseragent = require('random-useragent');
const randomColor = require('color-randomizer');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const urls = [
  'http://pecurgoa.com/1Q30',
  'http://pecurgoa.com/1PFT',
  'http://pecurgoa.com/1mwQ',
  'http://pecurgoa.com/1mxO',
  'http://pecurgoa.com/1mxu',
  'http://pecurgoa.com/1myT',
  'http://pecurgoa.com/1myo',
  'http://pecurgoa.com/1n09',
  'http://pecurgoa.com/1n0z',
  'http://pecurgoa.com/1n1L'
];

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max - min + 1))
}

(async function() {
  const ua = randomUseragent.getRandom();
  const options = new firefox.Options()
    .addArguments("-private")
    .addArguments("-headless")

    .setPreference('browser.active_color', randomColor({format: 'hex'}))
    .setPreference('browser.anchor_color', randomColor({format: 'hex'}))
    .setPreference('browser.display.use_focus_colors', true)
    .setPreference('browser.display.background_color', randomColor({format: 'hex'}))
    .setPreference('browser.display.focus_background_color', randomColor({format: 'hex'}))
    .setPreference('browser.display.screen_resolution', generateRandomInteger(800, 1200))

    .setPreference('browser.cache.disk.enable', false)
    .setPreference('browser.cache.disk_cache_ssl', false)
    .setPreference('browser.cache.memory.capacity', generateRandomInteger(-1, 0))
    .setPreference('geo.enabled', false)

    .setPreference('general.useragent.security', "N")
    .setPreference('general.useragent.override', ua)
    .setPreference('general.useragent.extra.',  generateRandomInteger(10, 10000))

    .setPreference('network.cookies.lifetimePolicy', 2)
    .setPreference('network.cookie.enableForCurrentSessionOnly', true)
    .setPreference('browser.privatebrowsing.autostart', true);

  const driver = await new Builder()
    .forBrowser('firefox')
    // .setProxy(proxy.socks('66.70.177.124:7497', 5))
    .setFirefoxOptions(options)
    .build();

  try {
    for await (const url of urls) {
      try {
        await driver.get(url);
        let exists = await driver.findElements(By.css('button.alert7-action-item:nth-child(2)')).then(found => !!found.length);
        if (exists) {
          await driver.findElement(By.css('button.alert7-action-item:nth-child(2)')).click();
        }
        await driver.actions()
          .keyDown(Key.ENTER)
          .sendKeys(Key.ENTER)
          .perform();

        await sleep(7000);
        const adnext = await driver.findElement(By.css('#skip_bu2tton'));
        await adnext.click();
        await sleep(1000);
        console.log(url + ' [OK]');
      } catch (e) {
        console.error(`Error: ${e}`);
      }
    }
  } finally {
    await driver.quit();
  }
})();