import fs from "fs";

export const searchedForFileName = (pkmn) => {
  console.log("pkmn", pkmn);

  if (pkmn.includes("-")) {
    return pkmn.split("-").slice(4).join("-");
  }
  return pkmn;
};

export function saveSellerMapEntries(searchedForFileName, allListings) {
  // console.log("ALL LISTINGS: ", allListings, allListings.length); // hit here from main function
  console.log("searchedForFileName: ", searchedForFileName); // hit here from main function
  fs.writeFile(
    `sellerMapEntrees_${searchedForFileName}.json`,
    JSON.stringify(allListings, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing seller map entrees", err);
      } else {
        console.log("seller map entrees saved!");
      }
    }
  );
}

export const urlMatcher = (url) => {
  let match = url.match(/\/pokemon-sv-[^\/]*-([a-z]+)-\d+-\d+\?/i);
  if (!match) {
    match = url.match(/pokemon-japan-(.+?)\?page/);
  }
  if (!match) {
    match = url.match(/\/pokemon-japan-[^\/]+\/([^\/?]+)/i); // fallback if structure is different
  }
  if (!match) {
    match = url.match(/\/product\/\d+\/([^\/?]+)/i); // New matcher for your example URL
  }

  return match;
};
