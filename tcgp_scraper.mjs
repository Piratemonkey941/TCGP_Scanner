import puppeteer from "puppeteer";
import {
  searchedForFileName,
  saveSellerMapEntries,
  urlMatcher,
} from "./tcg_helpers.mjs";

(async () => {
  console.log("Launching Browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Put links to TCGP cards here
  const pagesToScrape = [
    "https://www.tcgplayer.com/product/589983/pokemon-sv08-surging-sparks-latias-ex-076-191?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQr61RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/509980/pokemon-sv03-obsidian-flames-charizard-ex-223-197?page=1&Language=English",
    //  "",
  ];

  //Scraper Loop
  for (const url of pagesToScrape) {
    let allListings = [];
    let matchedURL = urlMatcher(url);
    const currentPokemon = matchedURL ? matchedURL[1] : null;

    await page.goto(url, { waitUntil: "networkidle2" });

    let pages = 0;

    while (true) {
      setTimeout(() => {
        console.log("Letting Page Load.");
      }, "1000");

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

      console.log("👉 Moving to next page...");
      const nextButton = await page.$('[aria-label="Next page"]');

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

    // console.log("currentPokemon: ", currentPokemon);

    const fileName = searchedForFileName(currentPokemon);

    // push to DB here currently being sent to files
    saveSellerMapEntries(fileName, allListings);
  }
  saveSellerMapEntries(searchedForFileName, allListings);

  await browser.close();
  // end of scraping process
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

  if a set can be found remove those from list and scan through with smaller set and provide additional set 

*/
