import fs from "fs-extra";
import path from "path";
import slugify from "slugify";

const dataPath = "client/src/data/plants_local.json";
const baseOut = "client/src/assets/plants_local_examples";

async function updatePlants() {
  const plants = JSON.parse(await fs.readFile(dataPath, "utf8"));
  const updated = [];

  for (const plant of plants) {
    const { id, name, species } = plant;
    const folder = path.join(baseOut, String(id));
    if (!(await fs.pathExists(folder))) {
      console.warn(`⚠️ Folder missing for ID ${id}: ${folder}`);
      updated.push(plant);
      continue;
    }

    // Rebuild the expected filename (same logic as generator)
    const filename = slugify(`${name}_${species}`, {
      lower: true,
      strict: true,
      replacement: "_",
    }) + ".jpg";

    const relPath = `/src/assets/plants_local_examples/${id}/${filename}`;
    const absPath = path.join(folder, filename);

    if (await fs.pathExists(absPath)) {
      plant.image = relPath;
      console.log(`✅ Linked image for ${id}: ${relPath}`);
    } else {
      console.warn(`❌ Missing image file for ${id}: ${absPath}`);
    }

    updated.push(plant);
  }

  await fs.writeJson(dataPath, updated, { spaces: 2 });
  console.log("🌿 Updated plants_local.json with image paths.");
}

updatePlants();
