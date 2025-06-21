import fs from "fs";
import path from "path";

const folderPath = "./scraped_to_join";
const outputFilePath = "./joined.json";
const allJsonData = [];

fs.readdirSync(folderPath).forEach((file) => {
  const filePath = path.join(folderPath, file);

  if (path.extname(file) === ".json") {
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(rawData);
      allJsonData.push(parsedData);
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  }
});

fs.writeFileSync(outputFilePath, JSON.stringify(allJsonData, null, 2));
