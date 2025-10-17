// update_image_paths.js
import fs from "fs"
import path from "path"
import slugify from "slugify"

// --- CONFIG ---
const jsonPath = path.resolve("client/src/data/plants_local.json")
const backupPath = path.resolve("client/src/data/plants_local_backup.json")
const outputPath = jsonPath // overwrite the same file

// --- Load & backup ---
if (!fs.existsSync(jsonPath)) {
  console.error("❌ Could not find plants_local.json at", jsonPath)
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2))
console.log(`🪴 Backup created at ${backupPath}`)

// --- Normalize and update each record ---
const updated = data.map((plant) => {
  const { id, name, species } = plant
  if (!id || !name || !species) return plant

  // Safe filename using slugify (handles spaces & special chars)
  const filename = `${slugify(`${name}_${species}`, {
    lower: true,
    strict: true,
  })}.jpg`

  const imagePath = `/plants_local_examples/${id}/${filename}`
  return { ...plant, image: imagePath }
})

// --- Write updated JSON ---
fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2))
console.log(`✅ Updated image paths written to ${outputPath}`)
console.log("✨ Each record now includes a public-relative 'image' field.")
