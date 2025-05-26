
(async () => {
  const findVendorsInMultipleCards = (listing) => {
    const sellerMap = listing.reduce((map, { seller, pokemonValue }) => {
      map[seller] = map[seller] || new Set();
      map[seller].add(pokemonValue);
      return map;
    }, {});

    return Object.entries(sellerMap)
      .filter(([_, cards]) => cards.size > 1)
      .map(([seller, cards]) => ({ seller, cards: Array.from(cards) }));
  };

  console.log("vendor matches: ", findVendorsInMultipleCards(scrappedPokemon));
})();
