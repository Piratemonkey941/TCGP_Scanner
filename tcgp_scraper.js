const puppeteer = require("puppeteer");

(async () => {
  console.log("Launching Browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Put links to TCGP cards here
  const pagesToScrape = [
    "https://www.tcgplayer.com/product/566515/pokemon-japan-sv2a-pokemon-card-151-squirtle-170-165?page=1&Language=all",
    "https://www.tcgplayer.com/product/566516/pokemon-japan-sv2a-pokemon-card-151-wartortle-171-165?page=1&Language=all",
  ];

  let allListings = [];
  //https://www.tcgplayer.com/product/610359/pokemon-sv-prismatic-evolutions-pokemon?seller=9aad7cfd&page=1&Language=English
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

    return Object.entries(sellerMap)
      .filter(([_, data]) => data.cards.size > 1)
      .map(([seller, data]) => ({
        seller,
        cards: Array.from(data.cards),
        prices: data.prices,
      }));
  };

  const vendorsWithTotals = findVendorsInMultipleCards(allListings).map(
    (vendor) => {
      const totalPrice = vendor.prices.reduce((sum, price) => sum + price, 0);
      return { ...vendor, totalPrice };
    }
  );

  vendorsWithTotals.sort((a, b) => a.totalPrice - b.totalPrice);

  const top5AffordableVendors = vendorsWithTotals.slice(0, 5);

  console.log("Most affordable vendors: ", top5AffordableVendors);
})();
