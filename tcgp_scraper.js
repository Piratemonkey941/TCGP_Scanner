const puppeteer = require("puppeteer");

(async () => {
  console.log("Launching Browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.goto(
    "https://www.tcgplayer.com/product/566511?page=1&Language=all",
    { waitUntil: "networkidle2" }
  );

  let allListings = [];
  let pages = 0;

  while (true) {
    await page.waitForSelector(".product-details__listings-results");

    const listings = await page.$$eval(".listing-item", (items) =>
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
      }))
    );

    allListings.push(...listings);
    pages++;
    console.log(`✅ Got ${listings.length} listings from page ${pages}`);

    const nextButton = await page.$('[aria-label="Next page"]');

    console.log("👉 Moving to next page...");

    await nextButton.click();

    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("⏱️ Navigation timeout")), 15000)
        ),
      ]);
      // Optional: add a short buffer wait to ensure DOM content is stable
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.warn(err.message);
      console.warn("⚠️ Assuming no more pages. Exiting loop.");
      break;
    }
  }

  console.log("✅ listing found:", allListings);
  await browser.close();
})();
