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
    //Reverse Holo
    // //BLK
    // "https://www.tcgplayer.com/product/642531/pokemon-sv-black-bolt-air-balloon?Printing=Reverse+Holofoil&Language=English",
    // // //WHT
    // "https://www.tcgplayer.com/product/642197/pokemon-sv-white-flare-brave-bangle?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt4yRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642195/pokemon-sv-white-flare-tool-scrapper?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt4yZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // // ex
    // "https://www.tcgplayer.com/product/642486/pokemon-sv-black-bolt-zekrom-ex?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt92xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642498/pokemon-sv-black-bolt-excadrill-ex?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt92RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642518/pokemon-sv-black-bolt-genesect-ex?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt92lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642157/pokemon-sv-white-flare-jellicent-ex?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxt929QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // //BLK Pokeball
    // "https://www.tcgplayer.com/product/642696/pokemon-sv-black-bolt-snivy-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv0wtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642697/pokemon-sv-black-bolt-servine-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv0wNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642698/pokemon-sv-black-bolt-pansage-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv0w5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642700/pokemon-sv-black-bolt-petilil-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv01lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642701/pokemon-sv-black-bolt-lilligant-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv01pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642702/pokemon-sv-black-bolt-maractus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv01JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642703/pokemon-sv-black-bolt-karrablast-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv01dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642704/pokemon-sv-black-bolt-foongus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv031QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642705/pokemon-sv-black-bolt-amoonguss-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv03ZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642707/pokemon-sv-black-bolt-darumaka-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv039QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642708/pokemon-sv-black-bolt-darmanitan-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxv0yRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642712/pokemon-sv-black-bolt-larvesta-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuzFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642714/pokemon-sv-black-bolt-panpour-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuzZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642715/pokemon-sv-black-bolt-simipour-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuwxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642716/pokemon-sv-black-bolt-tympole-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuwhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642717/pokemon-sv-black-bolt-palpitoad-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuwpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // "https://www.tcgplayer.com/product/642718/pokemon-sv-black-bolt-seismitoad-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuwNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642719/pokemon-sv-black-bolt-tirtouga-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvuwdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642720/pokemon-sv-black-bolt-carracosta-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvu1hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642721/pokemon-sv-black-bolt-alomomola-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvu1pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642722/pokemon-sv-black-bolt-cubchoo-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvu1NQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642723/pokemon-sv-black-bolt-beartic-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvu15QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642724/pokemon-sv-black-bolt-cryogonal-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvr3dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642726/pokemon-sv-black-bolt-emolga-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvryxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642727/pokemon-sv-black-bolt-tynamo-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvryVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642728/pokemon-sv-black-bolt-eelektrik-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvryBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642730/pokemon-sv-black-bolt-thundurus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrytQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642731/pokemon-sv-black-bolt-munna-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvryNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642732/pokemon-sv-black-bolt-musharna-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvry9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642733/pokemon-sv-black-bolt-solosis-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrU1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642734/pokemon-sv-black-bolt-duosion-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrUFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642735/pokemon-sv-black-bolt-reuniclus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrUtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642736/pokemon-sv-black-bolt-elgyem-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrUdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642737/pokemon-sv-black-bolt-beheeyem-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642739/pokemon-sv-black-bolt-golurk-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642740/pokemon-sv-black-bolt-drilbur-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642741/pokemon-sv-black-bolt-timburr-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642742/pokemon-sv-black-bolt-gurdurr-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642743/pokemon-sv-black-bolt-conkeldurr-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrRdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642744/pokemon-sv-black-bolt-throh-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvrWxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642746/pokemon-sv-black-bolt-crustle-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoVJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642747/pokemon-sv-black-bolt-landorus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoVZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642749/pokemon-sv-black-bolt-whirlipede-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoXRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642750/pokemon-sv-black-bolt-scolipede-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoXlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642751/pokemon-sv-black-bolt-sandile-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoXFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642752/pokemon-sv-black-bolt-krokorok-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoXJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642753/pokemon-sv-black-bolt-krookodile-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoXZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642756/pokemon-sv-black-bolt-escavalier-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoX9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642421/pokemon-sv-black-bolt-klink-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoSRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642422/pokemon-sv-black-bolt-klang-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvoSdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642423/pokemon-sv-black-bolt-klinklang-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvt0xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642757/pokemon-sv-black-bolt-pawniard-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvt0lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642758/pokemon-sv-black-bolt-bisharp-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvt0FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642759/pokemon-sv-black-bolt-cobalion-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvt0JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642762/pokemon-sv-black-bolt-haxorus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxvt0dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642763/pokemon-sv-black-bolt-pidove-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvtxxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642764/pokemon-sv-black-bolt-tranquill-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvtxRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642765/pokemon-sv-black-bolt-unfezant-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPyhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642766/pokemon-sv-black-bolt-audino-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPyFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642767/pokemon-sv-black-bolt-minccino-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPyJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642768/pokemon-sv-black-bolt-cinccino-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPy5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642431/pokemon-sv-black-bolt-rufflet-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPU1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642432/pokemon-sv-black-bolt-braviary-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPUlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642528/pokemon-sv-black-bolt-energy-coin?Printing=Reverse+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPUNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642772/pokemon-sv-black-bolt-professors-research-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxvPRlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    // WHT Pokeball
    "https://www.tcgplayer.com/product/642362/pokemon-sv-white-flare-sewaddle-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqX21QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642363/pokemon-sv-white-flare-swadloon-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqX2hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642364/pokemon-sv-white-flare-leavanny-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqX2BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642365/pokemon-sv-white-flare-cottonee-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqX2tQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642367/pokemon-sv-white-flare-sawsbuck-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqX25QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642368/pokemon-sv-white-flare-shelmet-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXzhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642369/pokemon-sv-white-flare-accelgor-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXzBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642370/pokemon-sv-white-flare-virizion-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXzpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642371/pokemon-sv-white-flare-tepig-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXzNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642372/pokemon-sv-white-flare-pignite-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXzdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642373/pokemon-sv-white-flare-emboar-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXz9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642374/pokemon-sv-white-flare-pansear-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXwVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642375/pokemon-sv-white-flare-simisear-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXwBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642709/pokemon-sv-white-flare-litwick-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXwpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642711/pokemon-sv-white-flare-chandelure-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXwdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642376/pokemon-sv-white-flare-heatmor-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqXw9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642377/pokemon-sv-white-flare-oshawott-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNw8EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642378/pokemon-sv-white-flare-dewott-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN1wEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642379/pokemon-sv-white-flare-samurott-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN1kEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642381/pokemon-sv-white-flare-ducklett-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN1oEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642382/pokemon-sv-white-flare-swanna-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN1cEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642384/pokemon-sv-white-flare-vanillish-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN3kEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642385/pokemon-sv-white-flare-vanilluxe-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN3sEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642386/pokemon-sv-white-flare-blitzle-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqN3IEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642387/pokemon-sv-white-flare-zebstrika-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNy0EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642388/pokemon-sv-white-flare-joltik-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNykEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642389/pokemon-sv-white-flare-galvantula-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNyAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642391/pokemon-sv-white-flare-woobat-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNycEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642392/pokemon-sv-white-flare-swoobat-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNy4EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642393/pokemon-sv-white-flare-sigilyph-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNUQEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642394/pokemon-sv-white-flare-yamask-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNUAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642395/pokemon-sv-white-flare-cofagrigus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNUMEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642396/pokemon-sv-white-flare-gothita-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqNUYEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642404/pokemon-sv-white-flare-archen-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaUUEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642405/pokemon-sv-white-flare-archeops-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaUAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642406/pokemon-sv-white-flare-mienfoo-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaU8EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642407/pokemon-sv-white-flare-mienshao-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaRwEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642408/pokemon-sv-white-flare-terrakion-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaRgEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642409/pokemon-sv-white-flare-purrloin-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaRsEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642410/pokemon-sv-white-flare-liepard-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaRcEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642412/pokemon-sv-white-flare-scrafty-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaW0EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642413/pokemon-sv-white-flare-trubbish-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaWkEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642414/pokemon-sv-white-flare-garbodor-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaWoEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642415/pokemon-sv-white-flare-zorua-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaW4EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642416/pokemon-sv-white-flare-zoroark-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaTUEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642754/pokemon-sv-white-flare-vullaby-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaTEEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642755/pokemon-sv-white-flare-mandibuzz-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaQwEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642417/pokemon-sv-white-flare-deino-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaQAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642418/pokemon-sv-white-flare-zweilous-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaQcEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642419/pokemon-sv-white-flare-ferroseed-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaV0EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642420/pokemon-sv-white-flare-ferrothorn-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UkpxqaVEEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642424/pokemon-sv-white-flare-durant-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8RUEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642425/pokemon-sv-white-flare-druddigon-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8RkEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642426/pokemon-sv-white-flare-patrat-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8RAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642427/pokemon-sv-white-flare-watchog-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8RMEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642429/pokemon-sv-white-flare-herdier-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8R8EUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642430/pokemon-sv-white-flare-stoutland-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8WQEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
    "https://www.tcgplayer.com/product/642433/pokemon-sv-white-flare-tornadus-poke-ball-pattern?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukpxq8WAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
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
proivdes clickable links to user in human readable format


//Vintage Stuff
*/
// "https://www.tcgplayer.com/product/42360/pokemon-base-set-blastoise?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzBS5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42393/pokemon-base-set-clefairy?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzG0RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42415/pokemon-base-set-hitmonchan?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzG0hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42433/pokemon-base-set-magneton?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzG0FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42351/pokemon-base-set-nidoking?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzG0JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42352/pokemon-base-set-ninetales?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzG0dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/42355/pokemon-base-set-venusaur?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGx1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45121/pokemon-jungle-scyther-10?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGStQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&page=1",
// "https://www.tcgplayer.com/product/45122/pokemon-jungle-snorlax-11?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGS5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45124/pokemon-jungle-venomoth-13?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD01QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45125/pokemon-jungle-victreebel-14?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD2xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45126/pokemon-jungle-vileplume-15?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD2hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45127/pokemon-jungle-wigglytuff-16?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD2BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106979/pokemon-jungle-clefable-17?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD2tQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106981/pokemon-jungle-flareon-19?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD2NQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106982/pokemon-jungle-jolteon-20?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzD25QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106983/pokemon-jungle-kangaskhan-21?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzDzRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106989/pokemon-jungle-snorlax-27?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzDzBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106990/pokemon-jungle-vaporeon-28?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzDztQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45120/pokemon-jungle-clefable-1?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGXRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45128/pokemon-jungle-electrode-2?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGXhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45129/pokemon-jungle-flareon-3?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGXFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45130/pokemon-jungle-jolteon-4?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGXJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45132/pokemon-jungle-mr-mime-6?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGXZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45133/pokemon-jungle-nidoqueen-7?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGX9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45134/pokemon-jungle-pidgeot-8?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGSVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/45135/pokemon-jungle-pinsir-9?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzGSBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44418/pokemon-fossil-aerodactyl-1?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAwhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106518/pokemon-fossil-articuno-2?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAwBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106519/pokemon-fossil-ditto-3?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAwpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106520/pokemon-fossil-dragonite-4?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAwJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106521/pokemon-fossil-gengar-5?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAwdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106523/pokemon-fossil-hitmonlee-7?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA1xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106524/pokemon-fossil-hypno-8?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA1VQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106525/pokemon-fossil-kabutops-9?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA1BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44419/pokemon-fossil-lapras-10?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA1pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44420/pokemon-fossil-magneton-11?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA1ZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44423/pokemon-fossil-raichu-14?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA3xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44424/pokemon-fossil-zapdos-15?Printing=Unlimited+Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA3hQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44425/pokemon-fossil-articuno-17?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA3pQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44427/pokemon-fossil-dragonite-19?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA3NQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/44429/pokemon-fossil-haunter-21?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzA3dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106529/pokemon-fossil-moltres-27?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAyxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106530/pokemon-fossil-muk-28?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAylQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",
// "https://www.tcgplayer.com/product/106532/pokemon-fossil-zapdos-30?Printing=Unlimited&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXzAypQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&Condition=Heavily+Played&page=1",

//Promos and such
// "https://www.tcgplayer.com/product/620227/pokemon-blister-exclusives-alakazam-082-167-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcyBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/552783/pokemon-blister-exclusives-togekiss-085-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/610743/pokemon-blister-exclusives-tinkaton-105-193-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/556978/pokemon-blister-exclusives-hydreigon-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/551686/pokemon-deck-exclusives-munkidori-095-167?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMbwFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/604897/pokemon-deck-exclusives-vileplume-045-165-scarlet-and-violet-151?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1BQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/546428/pokemon-deck-exclusives-arboliva-023-198?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/583734/pokemon-deck-exclusives-hawlucha?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb1dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/583730/pokemon-deck-exclusives-indeedee?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb3xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/625324/pokemon-miscellaneous-cards-and-products-rhyperior-76-142-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcy1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/625325/pokemon-miscellaneous-cards-and-products-klinklang-101-142-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcyhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/604491/pokemon-miscellaneous-cards-and-products-koraidon-119-162-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcy9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/617017/pokemon-miscellaneous-cards-and-products-kingdra-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcU9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/602871/pokemon-miscellaneous-cards-and-products-palkia-040-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcRtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/623118/pokemon-miscellaneous-cards-and-products-chien-pao-057-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcRZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/602870/pokemon-miscellaneous-cards-and-products-zekrom-066-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcR5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/604413/pokemon-miscellaneous-cards-and-products-latios-073-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcW1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/557370/pokemon-miscellaneous-cards-and-products-steelix-125-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/557146/pokemon-miscellaneous-cards-and-products-porygon-z-144-182-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/631074/pokemon-miscellaneous-cards-and-products-iron-jugulis-158-182?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcWdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/602866/pokemon-miscellaneous-cards-and-products-dartrix-014-197-cosmos-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcTFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/549339/pokemon-miscellaneous-cards-and-products-gyarados-043-193-cosmo-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcQ1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
// "https://www.tcgplayer.com/product/637611/pokemon-miscellaneous-cards-and-products-cynthias-gible-cosmos-holo?Printing=Holofoil&Language=English&page=1",
// "https://www.tcgplayer.com/product/477848/pokemon-miscellaneous-cards-and-products-sprigatito-013-198-mirage-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/505047/pokemon-miscellaneous-cards-and-products-dondozo-061-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbVxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/505042/pokemon-miscellaneous-cards-and-products-armarouge-041-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSFvUFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/505040/pokemon-miscellaneous-cards-and-products-arboliva-023-198-line-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSFvyZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&page=1",
// "https://www.tcgplayer.com/product/505057/pokemon-deck-exclusives-lechonk-154-198-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksS2bVAEUvRww0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/637611/pokemon--cynthia-s-gible-cosmos-holo?Language=English",
// "https://www.tcgplayer.com/product/639953/pokemon-miscellaneous-cards-and-products-team-rockets-meowth-cosmos-holo?page=1&Language=English",
// "https://www.tcgplayer.com/product/477848/pokemon-miscellaneous-cards-and-products-sprigatito-013-198-mirage-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnUJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English&page=1",
// "https://www.tcgplayer.com/product/497599/pokemon-sv02-paldea-evolved-sprigatito-196-193?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSji1JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/568127/pokemon-japan-sv1a-triplet-beat-sprigatito-004-073?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjiRxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
// "https://www.tcgplayer.com/product/567602/pokemon-japan-sv4a-shiny-treasure-ex-sprigatito-201-190?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnWhQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
// "https://www.tcgplayer.com/product/568198/pokemon-japan-sv1a-triplet-beat-sprigatito-075-073?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnTRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
// "https://www.tcgplayer.com/product/591247/pokemon-japan-sv-ex-starter-set-sprigatito-and-lucario-ex-sprigatito?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnQxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
// "https://www.tcgplayer.com/product/497600/pokemon-sv02-paldea-evolved-floragato-197-193?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjE21QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/497675/pokemon-sv02-paldea-evolved-meowscarada-ex-256-193?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjEzFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537979/pokemon-jumbo-cards-meowscarada-ex-078?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjEw1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// //
// "https://www.tcgplayer.com/product/477184/pokemon-sv-scarlet-and-violet-promo-cards-sprigatito-001?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb2FQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/477182/pokemon-sv-scarlet-and-violet-promo-cards-fuecoco-002?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4xpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/487755/pokemon-sv-scarlet-and-violet-promo-cards-hawlucha-007-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbSRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/487756/pokemon-sv-scarlet-and-violet-promo-cards-revavroom-008-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJbShQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/484396/pokemon-sv-scarlet-and-violet-promo-cards-lucario-ex-017?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksXbbQRQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/500062/pokemon-sv-scarlet-and-violet-promo-cards-miraidon-ex-028?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4RlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/500070/pokemon-sv-scarlet-and-violet-promo-cards-koraidon-ex-029?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4RpQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/505534/pokemon-sv-scarlet-and-violet-promo-cards-chien-pao-ex-030?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4W1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/505537/pokemon-sv-scarlet-and-violet-promo-cards-tinkaton-ex-031?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4WFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/513876/pokemon-sv-scarlet-and-violet-promo-cards-meowscarada-ex-033?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4W5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/513831/pokemon-sv-scarlet-and-violet-promo-cards-skeledirge-ex-034?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D4T1QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/512896/pokemon-sv-scarlet-and-violet-promo-cards-cleffa-037-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY0dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/518878/pokemon-sv-scarlet-and-violet-promo-cards-greninja-ex-054?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D905QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/526574/pokemon-sv-scarlet-and-violet-promo-cards-chi-yu-057-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D9xBQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/526640/pokemon-sv-scarlet-and-violet-pr?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D9xNQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/536070/pokemon-sv-scarlet-and-violet-promo-cards-fidough-069?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D9whQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/536072/pokemon-sv-scarlet-and-violet-promo-cards-greavard-070?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D9wFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/535952/pokemon-sv-scarlet-and-violet-promo-cards-mimikyu-075?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0D9wZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537971/pokemon-sv-scarlet-and-violet-promo-cards-sprigatito-076?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnU5QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537978/pokemon-sv-scarlet-and-violet-promo-cards-meowscarada-ex-078?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjEwxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537818/pokemon-sv-scarlet-and-violet-promo-cards-fuecoco-079?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0uo3dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537981/pokemon-sv-scarlet-and-violet-promo-cards-crocalor-080?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0uo39QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/537973/pokemon-sv-scarlet-and-violet-promo-cards-quaquaval-ex-084?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0uoyJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/543950/pokemon-sv-scarlet-and-violet-promo-cards-feraligatr-089-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY25QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/543948/pokemon-sv-scarlet-and-violet-promo-cards-iron-thorns-098?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0uoTlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/525293/pokemon-sv-scarlet-and-violet-promo-cards-oddish-102?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMb3VQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/546754/pokemon-sv-scarlet-and-violet-promo-cards-houndoom-ex-103?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0au2JQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/546755/pokemon-sv-scarlet-and-violet-promo-cards-melmetal-ex-104?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0au2dQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/551688/pokemon-sv-scarlet-and-violet-promo-cards-thwackey-115?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYzJQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/551691/pokemon-sv-scarlet-and-violet-promo-cards-froslass-117?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJYzdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/556449/pokemon-sv-scarlet-and-violet-promo-cards-palafin-ex-126?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auTdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/554298/pokemon-sv-scarlet-and-violet-promo-cards-walking-wake-ex-127?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auWVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/554299/pokemon-sv-scarlet-and-violet-promo-cards-iron-leaves-ex-128?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auQxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/562087/pokemon-sv-scarlet-and-violet-promo-cards-kingambit-130?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auQlQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/585578/pokemon-sv-scarlet-and-violet-promo-cards-horsea-137-cosmo-holo?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auQtQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/585577/pokemon-sv-scarlet-and-violet-promo-cards-porygon2-138-cosmos-holo?Printing=Normal&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auQZQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/579993/pokemon-sv-scarlet-and-violet-promo-cards-gouging-fire-ex-144?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auVdQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/583850/pokemon-sv-scarlet-and-violet-promo-cards-raging-bolt-ex-145?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3Ukp0auXxQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/594382/pokemon-sv-scarlet-and-violet-promo-cards-gouging-fire-151?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1xQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/594385/pokemon-sv-scarlet-and-violet-promo-cards-magneton-153?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "",
// "https://www.tcgplayer.com/product/594388/pokemon-sv-scarlet-and-violet-promo-cards-indeedee-154?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY1lQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/623233/pokemon-sv-scarlet-and-violet-promo-cards-ns-darmanitan-181-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY19QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/623234/pokemon-sv-scarlet-and-violet-promo-cards-ionos-kilowattrel-182-prerelease?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVJY3RQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/627706/pokemon-sv-scarlet-and-violet-promo-cards-yanma-185?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcV9QwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/627725/pokemon-sv-scarlet-and-violet-promo-cards-scrafty-188?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksVMcXVQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=English",
// "https://www.tcgplayer.com/product/635467/pokemon-sv-scarlet-and-violet-promo-cards-team-rockets-wobbuffet?page=1&Language=English",
// "https://www.tcgplayer.com/product/587920/pokemon-japan-sv-p-promotional-cards-sprigatito-213-sv-p?Printing=Holofoil&irclickid=x5RwjwVcOxyKRzsyqkxJB3g3UksSjnTFQwfzRM0&sharedid=&irpid=4915895&irgwc=1&utm_source=impact&utm_medium=affiliate&utm_campaign=TCG+Collector&Language=all",
