import fs from "fs"
import path from "path"
import url from "url"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, "client/src/data/plants_local.json")
const publicRoot = path.join(__dirname, "client/public")

const plants = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

let missing = []

for (const p of plants) {
  const imgPath = p.image
  const resolved = imgPath
    ? path.join(publicRoot, imgPath.replace(/^\//, ""))
    : null

  if (!imgPath || !fs.existsSync(resolved)) {
    missing.push({
      id: p.id,
      name: p.name,
      image: imgPath || "(none)",
    })
  }
}

if (missing.length) {
  console.log("\n❌ Missing or broken image paths:\n")
  missing.forEach((m) =>
    console.log(
      `  [${m.id}] ${m.name}\n    image: ${m.image}\n`
    )
  )
} else {
  console.log("✅ All plant images verified successfully.")
}

console.log(`\nSummary: ${plants.length - missing.length} valid, ${missing.length} missing.\n`)
