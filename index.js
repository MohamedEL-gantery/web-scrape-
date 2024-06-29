const puppeteer = require("puppeteer");
const cron = require("node-cron");

const twitterAccounts = [
  "https://twitter.com/Mr_Derivatives",
  "https://twitter.com/warrior_0719",
  "https://twitter.com/ChartingProdigy",
  "https://twitter.com/allstarcharts",
  "https://twitter.com/yuriymatso",
  "https://twitter.com/TriggerTrades",
  "https://twitter.com/AdamMancini4",
  "https://twitter.com/CordovaTrades",
  "https://twitter.com/Barchart",
  "https://twitter.com/RoyLMattox",
];

// Function to start scrape and count mentions of the symbol
const startScrape = async (account, symbol) => {
  try {
    let browser;
    // Launch the browser and open a new blank page
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Navigate the page to a URL.
    await page.goto(account, { waitUntil: "networkidle2" });

    let mentionCount = 0;

    const mention = await page.$$eval("article div[lang]", (elements) =>
      elements.map((el) => el.textContent)
    );
    mentionCount = mention.filter((text) => text.includes(symbol)).length;

    // Close the browser after scraping
    await browser.close();

    return mentionCount;
  } catch (err) {
    console.log(err);
  }
};

// Function to get scraping
const getScrape = async (accounts, symbol, time) => {
  try {
    let totalMentions = 0;

    for (const account of accounts) {
      const count = await startScrape(account, symbol);
      totalMentions += count;
    }

    console.log(
      `'${symbol}' was mentioned '${totalMentions}' times in the last '${time}' minutes.`
    );
  } catch (err) {
    console.log(err);
  }
};

const scheduleScraping = (accounts, symbol, time) => {
  try {
    cron.schedule(`*/${time} * * * *`, async () => {
      await getScrape(accounts, symbol, time);
    });
  } catch (err) {
    console.log(err);
  }
};

scheduleScraping(twitterAccounts, "$TSLA", 1);
