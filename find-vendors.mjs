import { allListings } from "./allListings.mjs";

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

const valueFinder = (allListings) => {
  const vendorsWithTotals = findVendorsInMultipleCards(allListings).map(
    (vendor) => ({
      ...vendor,
      totalPrice: vendor.prices.reduce((sum, price) => sum + price, 0),
    })
  );

  vendorsWithTotals.sort((a, b) => a.totalPrice - b.totalPrice);

  //   would need to return for FE
  const top5AffordableVendors = vendorsWithTotals.slice(0, 10);
  console.log(
    "Most affordable vendors for these items: ",
    top5AffordableVendors
  );
};

valueFinder(allListings);
