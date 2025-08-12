import puppeteer from "puppeteer";
import {
  searchedForFileName,
  saveSellerMapEntries,
  urlMatcher,
} from "./tcg_helpers.mjs";
import { cardWishList } from "./cards_wishlist.mjs";

(async () => {
  console.log("Launching Browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let urlCount = 0;

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  //Scraper Loop
  for (const url of cardWishList) {
    urlCount++;
    console.log(`On Url ${urlCount} of ${pagesToScrape.length}`);
    let allListings = [];
    let matchedURL = urlMatcher(url);
    const currentPokemon = matchedURL ? matchedURL[1] : null;

    await page.goto(url, { waitUntil: "networkidle2" });

    await new Promise((resolve) =>
      setTimeout(resolve, 100 + Math.random() * 100)
    );

    let pages = 0;

    while (true) {
      if (pages > 10) {
        console.log("🛑 Reached 10 page limit. Exiting loop.");
        break;
      }

      console.log("Letting Page Load...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let retries = 0;
      while (retries < 2) {
        try {
          await page.waitForSelector(".product-details__listings-results", {
            timeout: 1000,
          });
          break;
        } catch {
          console.warn(`Retry ${retries + 1} for listings selector...`);
          retries++;
          await page.reload({ waitUntil: "domcontentloaded" });
        }
      }
      if (retries === 2) {
        console.warn("❌ Giving up on this page.");
        break;
      }

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

      console.log("👉 Moving to next page...");
      const nextButton = await page.$('[aria-label="Next page"]');

      //maybe small time delay here, race condition?
      await nextButton.click();

      try {
        await Promise.race([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("⏱️ Navigation timeout")), 6000)
          ),
        ]);

        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (err) {
        //retry somewhere in here?
        console.warn(err.message);
        console.warn("⚠️ Assuming no more pages. Exiting loop.");
        break;
      }
    }

    const fileName = searchedForFileName(currentPokemon);

    // push to DB here currently being sent to files
    saveSellerMapEntries(currentPokemon, allListings);
  }

  await browser.close();
  console.log("Scraping finished");
  // end of scraping process
})();

// still needed links

/*ideas for improvement
  1. check Db before scraping for that entree
  2. send scraped array to DB 

  if entree exists it will need to be fetch 
  entree will contain all vendors so anything new will be compared against it

  need to build in redundancy for scraping

  simple webapp for usability

  way of removing vendors/user reporting and rerunning script
  use vendor name to ping tcgplayer to see if vendor has items?

  if a set can be found remove those from list and scan through with smaller set and provide additional set 
user inputs links
logic checks DB 
if not in db It scrapes 
then it figures out best vendors
passes to front end
provides clickable links to user in human readable format

