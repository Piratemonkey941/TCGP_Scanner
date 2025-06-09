import { allListings } from "./allListings.mjs";
// Flattened vendor logic that works across arrays of card listings
const findVendorsInMultipleCards = (allListings) => {
  const sellerMap = {};

  allListings.forEach((cardListings) => {
    cardListings.forEach(({ seller, pokemonValue, price }) => {
      if (!sellerMap[seller]) {
        sellerMap[seller] = {
          cards: new Set(),
          prices: [],
        };
      }

      sellerMap[seller].cards.add(pokemonValue);
      sellerMap[seller].prices.push(
        parseFloat(price?.startsWith("$") ? price.slice(1) : price) || 0
      );
    });
  });

  return Object.entries(sellerMap)
    .map(([seller, data]) => ({
      seller,
      cards: Array.from(data.cards),
      prices: data.prices,
    }))
    .filter((vendor) => vendor.cards.length > 1); // minimum 2 matches
};

const valueFinder = (allListings) => {
  const cardsToMatch = allListings.length;
  let vendorsWithTotals = [];

  for (let count = cardsToMatch; count > 0; count--) {
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
    "Most affordable vendors for these items:",
    top5AffordableVendors
  );
  return top5AffordableVendors;
};

// Call the function
valueFinder(allListings);
