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
    "https://www.tcgplayer.com/product/632914/pokemon-sv10-destined-rivals-hippowdon?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYd3dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632940/pokemon-sv10-destined-rivals-marnies-scraggy?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYdyRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632940/pokemon-sv10-destined-rivals-marnies-scraggy?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYdVRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632941/pokemon-sv10-destined-rivals-marnies-scrafty?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYdVBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632942/pokemon-sv10-destined-rivals-marnies-impidimp?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYdVtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632943/pokemon-sv10-destined-rivals-marnies-morgrem?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYdVNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632952/pokemon-sv10-destined-rivals-zamazenta-146-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfzxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/630830/pokemon-sv10-destined-rivals-team-rockets-giovanni?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfzFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632977/pokemon-sv10-destined-rivals-team-rockets-proton-177-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfzJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632979/pokemon-sv10-destined-rivals-team-rockets-venture-bomb?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfzdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632980/pokemon-sv10-destined-rivals-team-rockets-watchtower?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfwxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632981/pokemon-sv10-destined-rivals-tm-machine?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfwhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632982/pokemon-sv10-destined-rivals-team-rockets-energy?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfwFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/560372/pokemon-sv-shrouded-fable-night-stretcher?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYfwdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/523841/pokemon-sv04-paradox-rift-counter-catcher?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYf1xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/509778/pokemon-sv03-obsidian-flames-arven?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYf1pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/509778/pokemon-sv03-obsidian-flames-arven?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYf3tQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/488071/pokemon-sv01-scarlet-and-violet-base-set-arven-166-198?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksQYf35QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
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
      if (pages > 10) {
        console.log("🛑 Reached 10 page limit. Exiting loop.");
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
