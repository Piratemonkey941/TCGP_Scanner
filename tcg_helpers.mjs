export const searchedForFileName = (pkmn) => {
  return pkmn.split("-").slice(4).join("-");
};

//   const searchedForFileName = cleanedPokemonNamed.join("");
