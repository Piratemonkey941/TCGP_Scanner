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

  // Put links to TCGP cards here, use shift option to add more lines.
  const pagesToScrape = [
    "https://www.tcgplayer.com/product/632858/pokemon-sv10-destined-rivals-ethans-ho-oh-ex-039-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBo3xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632891/pokemon-sv10-destined-rivals-team-rockets-mewtwo-ex-081-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBo3VQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632927/pokemon-sv10-destined-rivals-team-rockets-nidoking-ex-119-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBo3lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632930/pokemon-sv10-destined-rivals-team-rockets-crobat-ex-122-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBo3pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632946/pokemon-sv10-destined-rivals-arvens-mabosstiff-ex-139-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBo3JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/623451/pokemon-sv09-journey-together-blaziken-ex?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBoyxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/590025/pokemon-sv08-surging-sparks-pikachu-ex-057-191?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBoyRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/589867/pokemon-sv08-surging-sparks-archaludon-ex-130-191?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBoyhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/567376/pokemon-sv07-stellar-crown-terapagos-ex-128-142?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBoytQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/534416/pokemon-sv05-paldean-fates-charizard-ex-054-091?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVBoyZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632836/pokemon-sv10-destined-rivals-shaymin-010-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvVxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&page=1",
    "https://www.tcgplayer.com/product/630815/pokemon-sv10-destined-rivals-mistys-magikarp?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvVJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632866/pokemon-sv10-destined-rivals-cynthias-milotic?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvVZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632871/pokemon-sv10-destined-rivals-floatzel?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvV9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632886/pokemon-sv10-destined-rivals-manectric?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvX1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632898/pokemon-sv10-destined-rivals-team-rockets-orbeetle-089-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvXVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632943/pokemon-sv10-destined-rivals-marnies-morgrem?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvXpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632952/pokemon-sv10-destined-rivals-zamazenta-146-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvXNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/630818/pokemon-sv10-destined-rivals-team-rockets-zapdos?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVbl3QEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/632977/pokemon-sv10-destined-rivals-team-rockets-proton-177-182?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvS1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/567341/pokemon-sv07-stellar-crown-noctowl?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvSFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/560372/pokemon-sv-shrouded-fable-night-stretcher?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvSJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/542828/pokemon-sv05-temporal-forces-relicanth-084-162?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMvSdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/523841/pokemon-sv04-paradox-rift-counter-catcher?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMq01QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/509778/pokemon-sv03-obsidian-flames-arven?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMq0hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/560370/pokemon-sv-shrouded-fable-janines-secret-art-059-064?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVbn08EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/487913/pokemon-sv01-scarlet-and-violet-base-set-dondozo-061-198?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMq0tQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/488071/pokemon-sv01-scarlet-and-violet-base-set-arven-166-198?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMqxxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/488092/pokemon-sv01-scarlet-and-violet-base-set-pokegear-30?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMqxhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/630150/pokemon-miscellaneous-cards-and-products-lillies-pearl-151-159-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMc39QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/625324/pokemon-miscellaneous-cards-and-products-rhyperior-76-142-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcy1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/625325/pokemon-miscellaneous-cards-and-products-klinklang-101-142-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcyhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/620227/pokemon-blister-exclusives-alakazam-082-167-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcyBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/604491/pokemon-miscellaneous-cards-and-products-koraidon-119-162-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcy9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/604492/pokemon-miscellaneous-cards-and-products-miraidon-121-162-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcUNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/617017/pokemon-miscellaneous-cards-and-products-kingdra-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcU9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/602871/pokemon-miscellaneous-cards-and-products-palkia-040-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcRtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623118/pokemon-miscellaneous-cards-and-products-chien-pao-057-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcRZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/602870/pokemon-miscellaneous-cards-and-products-zekrom-066-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcR5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/604413/pokemon-miscellaneous-cards-and-products-latios-073-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcW1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/557370/pokemon-miscellaneous-cards-and-products-steelix-125-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/557146/pokemon-miscellaneous-cards-and-products-porygon-z-144-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/631074/pokemon-miscellaneous-cards-and-products-iron-jugulis-158-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/602839/pokemon-miscellaneous-cards-and-products-rowlet-013-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/602866/pokemon-miscellaneous-cards-and-products-dartrix-014-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/562170/pokemon-miscellaneous-cards-and-products-frogadier-057-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/552783/pokemon-blister-exclusives-togekiss-085-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/549339/pokemon-miscellaneous-cards-and-products-gyarados-043-193-cosmo-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQ1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
    // "https://www.tcgplayer.com/product/610743/pokemon-blister-exclusives-tinkaton-105-193-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/556978/pokemon-blister-exclusives-hydreigon-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/544444/pokemon-miscellaneous-cards-and-products-maschiff-142-193-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/619034/pokemon-miscellaneous-cards-and-products-spiritomb-129-198-cosmo-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQ9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/491187/pokemon-sv-scarlet-and-violet-promo-cards-dondozo-012?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcVVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/532538/pokemon-sv-scarlet-and-violet-promo-cards-varoom-026-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcVlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/526638/pokemon-sv-scarlet-and-violet-promo-cards-sinistea-062?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcVFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/554296/pokemon-sv-scarlet-and-violet-promo-cards-revavroom-121?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcVNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/627706/pokemon-sv-scarlet-and-violet-promo-cards-yanma-185?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcV9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/627707/pokemon-sv-scarlet-and-violet-promo-cards-scraggy-186?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcX1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/627725/pokemon-sv-scarlet-and-violet-promo-cards-scrafty-188?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcXVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/637611/pokemon-miscellaneous-cards-and-products-cynthias-gible-cosmos-holo?Printing=Holofoil&Language=English&page=1",
    // "https://www.tcgplayer.com/product/637612/pokemon-miscellaneous-cards-and-products-cynthias-gabite-cosmos-holo?Printing=Holofoil&Language=English&page=1",
    // "https://www.tcgplayer.com/product/477848/pokemon-miscellaneous-cards-and-products-sprigatito-013-198-mirage-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/477184/pokemon-sv-scarlet-and-violet-promo-cards-sprigatito-001?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/477182/pokemon-sv-scarlet-and-violet-promo-cards-fuecoco-002?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2tQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/477183/pokemon-sv-scarlet-and-violet-promo-cards-quaxly-003?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2ZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/576969/pokemon-deck-exclusives-bouffalant-119-142?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/551685/pokemon-deck-exclusives-froslass-053-167?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/551686/pokemon-deck-exclusives-munkidori-095-167?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/552442/pokemon-deck-exclusives-fezandipiti-096-167?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/543958/pokemon-deck-exclusives-flutter-mane-078-162?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/542828/pokemon-sv05-temporal-forces-relicanth-084-162?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbw9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/528308/pokemon-deck-exclusives-aegislash-134-182-non-holo?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/604897/pokemon-deck-exclusives-vileplume-045-165-scarlet-and-violet-151?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/546428/pokemon-deck-exclusives-arboliva-023-198?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/583734/pokemon-deck-exclusives-hawlucha?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/583730/pokemon-deck-exclusives-indeedee?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb3xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/525293/pokemon-sv-scarlet-and-violet-promo-cards-oddish-102?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb3VQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610624/pokemon-sv-prismatic-evolutions-kieran-113-131-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJAxFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610626/pokemon-sv-prismatic-evolutions-larrys-skill-115-131-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJAxdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610627/pokemon-sv-prismatic-evolutions-ogres-mask-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610628/pokemon-sv-prismatic-evolutions-professor-sadas-vitality-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610632/pokemon-sv-prismatic-evolutions-professors-research-professor-rowan-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610633/pokemon-sv-prismatic-evolutions-professors-research-professor-sycamore-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610634/pokemon-sv-prismatic-evolutions-rescue-board-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610635/pokemon-sv-prismatic-evolutions-roto-stick-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA2dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610538/pokemon-sv-prismatic-evolutions-pinsir-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDVRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610539/pokemon-sv-prismatic-evolutions-budew-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDVFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610540/pokemon-sv-prismatic-evolutions-leafeon-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDVJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610543/pokemon-sv-prismatic-evolutions-applin-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDVZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610548/pokemon-sv-prismatic-evolutions-slowpoke-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDV9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610566/pokemon-sv-prismatic-evolutions-munkidori-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDXRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610570/pokemon-sv-prismatic-evolutions-pupitar-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDXBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610573/pokemon-sv-prismatic-evolutions-hippopotas-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDXpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610575/pokemon-sv-prismatic-evolutions-bloodmoon-ursaluna-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDXNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610578/pokemon-sv-prismatic-evolutions-umbreon-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDX5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610582/pokemon-sv-prismatic-evolutions-roaring-moon-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDSxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610588/pokemon-sv-prismatic-evolutions-dreepy-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDSVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610594/pokemon-sv-prismatic-evolutions-dudunsparce-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDSFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610598/pokemon-sv-prismatic-evolutions-fan-rotom-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDSNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610601/pokemon-sv-prismatic-evolutions-furfrou-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJDSdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610449/pokemon-sv-prismatic-evolutions-area-zero-underdepths?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA0xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610450/pokemon-sv-prismatic-evolutions-binding-mochi?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA0VQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610607/pokemon-sv-prismatic-evolutions-black-belts-training-096-131-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA0BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610608/pokemon-sv-prismatic-evolutions-black-belts-training-097-131-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA0NQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610611/pokemon-sv-prismatic-evolutions-briar-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJA0dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610617/pokemon-sv-prismatic-evolutions-earthen-vessel-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJAx1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/610619/pokemon-sv-prismatic-evolutions-festival-grounds-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJAxhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/505040/pokemon-miscellaneous-cards-and-products-arboliva-023-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbQtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/505042/pokemon-miscellaneous-cards-and-products-armarouge-041-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbQNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/505047/pokemon-miscellaneous-cards-and-products-dondozo-061-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbVxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/487751/pokemon-sv-scarlet-and-violet-promo-cards-quaquaval-005-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbXdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/487752/pokemon-sv-scarlet-and-violet-promo-cards-pawmot-006-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbX9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/487755/pokemon-sv-scarlet-and-violet-promo-cards-hawlucha-007-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbSRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/487756/pokemon-sv-scarlet-and-violet-promo-cards-revavroom-008-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbShQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/501885/pokemon-sv-scarlet-and-violet-promo-cards-baxcalibur-019-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbS9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/501888/pokemon-sv-scarlet-and-violet-promo-cards-tinkaton-020-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY01QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/501893/pokemon-sv-scarlet-and-violet-promo-cards-murkrow-021-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY0hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/501896/pokemon-sv-scarlet-and-violet-promo-cards-pelipper-022-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY0FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/512896/pokemon-sv-scarlet-and-violet-promo-cards-cleffa-037-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY0dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/526610/pokemon-sv-scarlet-and-violet-promo-cards-aegislash-060-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYxdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/543950/pokemon-sv-scarlet-and-violet-promo-cards-feraligatr-089-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY25QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/543951/pokemon-sv-scarlet-and-violet-promo-cards-metang-090-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYz1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/551688/pokemon-sv-scarlet-and-violet-promo-cards-thwackey-115?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYzJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/551691/pokemon-sv-scarlet-and-violet-promo-cards-froslass-117?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYzdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/551692/pokemon-sv-scarlet-and-violet-promo-cards-tatsugiri-118?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYwxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/594382/pokemon-sv-scarlet-and-violet-promo-cards-gouging-fire-151?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/594385/pokemon-sv-scarlet-and-violet-promo-cards-magneton-153?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/594388/pokemon-sv-scarlet-and-violet-promo-cards-indeedee-154?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623233/pokemon-sv-scarlet-and-violet-promo-cards-ns-darmanitan-181-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY19QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/623234/pokemon-sv-scarlet-and-violet-promo-cards-ionos-kilowattrel-182-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY3RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/505050/pokemon-miscellaneous-cards-and-products-pawmot-076-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJd05QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "",
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

      let retries = 0;
      while (retries < 2) {
        try {
          await page.waitForSelector(".product-details__listings-results", {
            timeout: 10000,
          });
          break; // found, move on
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
