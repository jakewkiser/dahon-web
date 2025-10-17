// fix_public_image_paths.js
import fs from "fs";
import path from "path";

const file = path.resolve("client/src/data/plants_local.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

for (const plant of data) {
  if (plant.image && plant.image.includes("/src/assets/")) {
    plant.image = plant.image.replace("/src/assets", "");
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("✅ All image paths updated to public-relative paths.");
