import puppeteer from "puppeteer";
import fs from "fs";
import { searchedForFileName } from "./tcg_helpers.mjs";

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

  let pokemonSearchedFor = [];

  //Url regex  HELPER?
  const urlMatcher = (url) => {
    let match = url.match(/\/pokemon-sv-[^\/]*-([a-z]+)-\d+-\d+\?/i);
    if (!match) {
      match = url.match(/pokemon-japan-(.+?)\?page/);
    }
    if (!match) {
      match = url.match(/\/pokemon-japan-[^\/]+\/([^\/?]+)/i); // fallback if structure is different
    }
    if (!match) {
      match = url.match(/\/product\/\d+\/([^\/?]+)/i); // New matcher for your example URL
    }

    pokemonSearchedFor.push(match[1]);
    return match;
  };

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

  //Creates .json file from listings HELPER?
  function saveSellerMapEntries(searchedForFileName, allListings) {
    console.log("ALL LISTINGS: ", allListings, allListings.length); // hit here from main function
    fs.writeFile(
      `sellerMapEntrees_${searchedForFileName}.json`,
      JSON.stringify(allListings, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing seller map entrees", err);
        } else {
          console.log("seller map entrees saved!");
        }
      }
    );
  }

  await browser.close();
  // end of scraping process

  //Vendor finding logic for looked for cards
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

  if a set can be found remove those from list and scan through with smaller set and provide additional set 

*/
