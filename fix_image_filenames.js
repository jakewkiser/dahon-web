// fix_image_filenames.js
import fs from "fs";
import path from "path";

// file paths
const dataPath = path.resolve("client/src/data/plants_local.json");
const backupPath = path.resolve("client/src/data/plants_local_backup_filenames.json");

// read
const plants = JSON.parse(fs.readFileSync(dataPath, "utf8"));
fs.writeFileSync(backupPath, JSON.stringify(plants, null, 2));
console.log(`🪴 Backup created at ${backupPath}`);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

for (const plant of plants) {
  if (!plant.image && plant.id) continue;

  const folder = `/plants_local_examples/${plant.id}`;
  const nameSlug = slugify(plant.name || "");
  const speciesSlug = slugify(plant.species || "");
  const newFile = `${nameSlug}_${speciesSlug}.jpg`;
  plant.image = `${folder}/${newFile}`;
}

fs.writeFileSync(dataPath, JSON.stringify(plants, null, 2));
console.log(`✅ Updated filenames written to ${dataPath}`);
console.log("✨ All image paths normalized (underscored name + species).");
