const axios = require("axios");
const cheerio = require("cheerio");
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
    console.log(`Scraping ${account}`);
    const res = await axios.get(account, { waitUntil: "networkidle2" });

    const $ = cheerio.load(res.data);

    let countMention = 0;
    $("article").each((index, element) => {
      const text = $(element).find("div[lang]").text();
      if (text.includes(symbol)) {
        countMention++;
      }
    });

    return countMention;
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
