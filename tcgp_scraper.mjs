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
  let urlCount = 0;

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Put links to TCGP cards here, iuse shift option to add more lines.
  const pagesToScrape = [
    // "https://www.tcgplayer.com/product/509919/pokemon-sv03-obsidian-flames-scizor?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9woEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623454/pokemon-sv09-journey-together-ns-darmanitan-027-159?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK4SYEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623494/pokemon-sv09-journey-together-lillies-ribombee-067-159?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK90sEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623583/pokemon-sv09-journey-together-redeemable-ticket?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK90IEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623585/pokemon-sv09-journey-together-super-potion?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK908EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623586/pokemon-sv09-journey-together-spiky-energy-159-159?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9xUEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610399/pokemon-sv-prismatic-evolutions-munkidori?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9zwEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610468/pokemon-sv-prismatic-evolutions-kieran-113-131?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9zkEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/542651/pokemon-sv05-temporal-forces-ancient-booster-energy-capsule?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9wwEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/523615/pokemon-sv04-paradox-rift-toedscool-015-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9wkEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/542651/pokemon-sv05-temporal-forces-ancient-booster-energy-capsule?irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQK9wwEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&page=1&Printing=Reverse+Holofoil",
    //  "",
  ];

  //Scraper Loop
  for (const url of pagesToScrape) {
    urlCount++;
    console.log(`On Url ${urlCount} of ${pagesToScrape.length}`);
    let allListings = [];
    let matchedURL = urlMatcher(url);
    const currentPokemon = matchedURL ? matchedURL[1] : null;

    await page.goto(url, { waitUntil: "networkidle2" });

    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1500)
    );

    let pages = 0;

    while (true) {
      if (pages > 50) {
        console.log("🛑 Reached 20 page limit. Exiting loop.");
        break;
      }

      console.log("Letting Page Load...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

    // console.log("currentPokemon: ", currentPokemon);

    const fileName = searchedForFileName(currentPokemon);

    // push to DB here currently being sent to files
    saveSellerMapEntries(fileName, allListings);
  }

  await browser.close();
  console.log("Scraping finished");
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
user inputs links
logic checks DB 
if not in db It scrapes 
then it figures out best vendors
passes to front end
proivdes clickable links to user in human readable format



*/
