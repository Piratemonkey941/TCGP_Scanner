import puppeteer from "puppeteer";
import fs from "fs";
// import { sellerMapEntrees } from "./sellerMapEntrees.mjs";

(async () => {
  console.log("Launching Browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  // const fs = require("fs");

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Put links to TCGP cards here
  const pagesToScrape = [
    "https://www.tcgplayer.com/product/566515/pokemon-japan-sv2a-pokemon-card-151-squirtle-170-165?page=1&Language=all",
    "https://www.tcgplayer.com/product/566516/pokemon-japan-sv2a-pokemon-card-151-wartortle-171-165?page=1&Language=all",
    "https://www.tcgplayer.com/product/566511/pokemon-japan-sv2a-pokemon-card-151-bulbasaur-166-165?page=1&Language=all",
    "https://www.tcgplayer.com/product/566512/pokemon-japan-sv2a-pokemon-card-151-ivysaur-167-165?page=1&Language=all",
  ];

  let allListings = [];
  for (const url of pagesToScrape) {
    let match = url.match(/product\/([^\/]+)-pokemon/);
    if (!match) {
      match = url.match(/pokemon-japan-(.+?)\?page/);
    }
    const currentPokemon = match ? match[1] : null;

    await page.goto(url, { waitUntil: "networkidle2" });

    let pages = 0;

    while (true) {
      await page.waitForSelector(".product-details__listings-results");

      const listings = await page.$$eval(
        ".listing-item",
        (items, currentPokemon) =>
          items.map((item) => ({
            seller: item.querySelector(".seller-info__name")?.innerText.trim(),
            condition: item
              .querySelector(".listing-item__listing-data__info__condition")
              ?.innerText.trim(),
            price: item
              .querySelector(".listing-item__listing-data__info__price")
              ?.innerText.trim(),
            shipping: item
              .querySelector(".shipping-messages__price")
              ?.innerText.trim(),
            pokemonValue: currentPokemon,
          })),
        currentPokemon
      );

      allListings.push(...listings);

      pages++;

      console.log(`✅ Got ${listings.length} listings from page ${pages}`);

      const nextButton = await page.$('[aria-label="Next page"]');

      console.log("👉 Moving to next page...");

      //maybe small time delay here, race condition?
      await nextButton.click();

      try {
        await Promise.race([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("⏱️ Navigation timeout")), 5000)
          ),
        ]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        //retry somewhere in here?
        console.warn(err.message);
        console.warn("⚠️ Assuming no more pages. Exiting loop.");
        break;
      }
    }
  }

  await browser.close();

  const findVendorsInMultipleCards = (allListings) => {
    const sellerMap = allListings.reduce(
      (map, { seller, pokemonValue, price }) => {
        if (!map[seller]) {
          map[seller] = {
            cards: new Set(),
            prices: [],
          };
        }
        map[seller].cards.add(pokemonValue);
        map[seller].prices.push(
          parseFloat(price?.startsWith("$") ? price.slice(1) : price) || 0
        );

        return map;
      },
      {}
    );

    const sellerMapEntrees = Object.entries(sellerMap)
      .filter(([_, data]) => data.cards.size > 1)
      .map(([seller, data]) => ({
        seller,
        cards: Array.from(data.cards),
        prices: data.prices,
      }));

    // Turn on if you want to harvest data
    // fs.writeFile(
    //   "sellerMapEntrees.json",
    //   JSON.stringify(sellerMapEntrees, null, 2),
    //   (err) => {
    //     if (err) {
    //       console.error("Error writing seller map entrees", err);
    //     } else {
    //       console.log("seller map entrees saved!");
    //     }
    //   }
    // );

    return sellerMapEntrees;
  };

  let vendorsWithTotals = [];

  for (let count = pagesToScrape.length; count > 0; count--) {
    // vendorsWithTotals = sellerMapEntrees //if you want to test locally
    vendorsWithTotals = findVendorsInMultipleCards(allListings)
      .filter((vendor) => vendor.cards.length >= count)
      .map((vendor) => ({
        ...vendor,
        totalPrice: vendor.prices.reduce((sum, price) => sum + price, 0),
      }));

    if (vendorsWithTotals.length > 0) break;
  }

  vendorsWithTotals.sort((a, b) => a.totalPrice - b.totalPrice);

  const top5AffordableVendors = vendorsWithTotals.slice(0, 5);

  console.log(
    "Most affordable vendors for these items: ",
    top5AffordableVendors
  );
})();

/*ideas for improvement
  1. check Db before scraping for that entree
  2. send scraped array to DB 

  if entree exists it will need to be fetch 
  entree will contain all vendors so anything new will be compared against it

  need to build in redundancy for scraping

  simple webapp for usability

  way of removing vendors/user reporting and rerunning script
  use vendor name to ping tcgplayer to see if vendor has items?


*/
