import { allListings } from "./joined.mjs";

const vendorArg = process.argv[2];
const avgAmountPerCard = [];

const findVendorsInMultipleCards = (allListings) => {
  const sellerMap = {};
  const cardPriceMap = {};

  allListings.forEach((cardListings) => {
    cardListings.forEach(({ seller, pokemonValue, price }) => {
      if (!sellerMap[seller]) {
        sellerMap[seller] = {
          cards: new Set(),
          prices: [],
        };
      }

      const cleanPrice =
        parseFloat(price?.startsWith("$") ? price.slice(1) : price) || 0;

      // Track prices per card
      if (!cardPriceMap[pokemonValue]) {
        cardPriceMap[pokemonValue] = [];
      }
      cardPriceMap[pokemonValue].push(cleanPrice);

      // Track seller info
      if (!sellerMap[seller]) {
        sellerMap[seller] = {
          cards: new Set(),
          prices: [],
        };
      }

      sellerMap[seller].cards.add(pokemonValue);
      sellerMap[seller].prices.push(cleanPrice);
    });
  });

  // After processing all listings, calculate avg per card
  for (const [pokemon, prices] of Object.entries(cardPriceMap)) {
    const avg = prices.reduce((sum, val) => sum + val, 0) / prices.length;
    avgAmountPerCard.push({ pokemon, avgCost: avg });
  }

  return Object.entries(sellerMap)
    .map(([seller, data]) => ({
      seller,
      cards: Array.from(data.cards),
      prices: data.prices,
    }))
    .filter((vendor) => vendor.cards.length > 1); // minimum 2 matches
};

const valueFinder = (allListings, vendorArg) => {
  const allVendors = findVendorsInMultipleCards(allListings).map((vendor) => {
    const totalPrice = vendor.prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = totalPrice / vendor.cards.length;
    return {
      ...vendor,
      totalPrice,
      averagePrice,
    };
  });

  if (vendorArg) {
    const matchingVendors = allVendors.filter((vendor) =>
      vendor.seller.toLowerCase().includes(vendorArg.toLowerCase())
    );
    console.log(matchingVendors);
  } else {
    // Sort by: most cards matched (desc), then lowest average price (asc)
    allVendors.sort((a, b) => {
      if (b.cards.length !== a.cards.length) {
        return b.cards.length - a.cards.length; // prioritize more matches
      }
      return a.averagePrice - b.averagePrice; // then cheaper average
    });

    const top5AffordableVendors = allVendors.slice(0, 10);

    top5AffordableVendors.forEach((vendor, index) => {
      console.log(
        `#${index + 1}: ${vendor.seller} - ${
          vendor.cards.length
        } cards - $${vendor.totalPrice.toFixed(
          2
        )} total - $${vendor.averagePrice.toFixed(2)} avg/card`
      );
    });

    top5AffordableVendors.forEach((vendor, index) => {
      console.log(
        `\n#${index + 1}: ${vendor.seller} - ${
          vendor.cards.length
        } cards - $${vendor.totalPrice.toFixed(
          2
        )} total - $${vendor.averagePrice.toFixed(2)} avg/card`
      );

      vendor.cards.forEach((cardName, i) => {
        const cardPrice = vendor.prices[i];
        console.log(`   - ${cardName}: $${cardPrice.toFixed(2)}`);
      });
    });

    console.log("\n\nAverage price per card:");
    avgAmountPerCard
      .sort((a, b) => b.avgCost - a.avgCost) // optional: priciest first
      .forEach(({ pokemon, avgCost }) => {
        console.log(` - ${pokemon}: $${avgCost.toFixed(2)}`);
      });
    return top5AffordableVendors;
  }
};

valueFinder(allListings, vendorArg);

// find most expensive cards first then check them for other options
