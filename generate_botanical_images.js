import OpenAI from "openai";
import fs from "fs-extra";
import slugify from "slugify";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const dataPath = "client/src/data/plants_local.json";
const baseOut = "client/src/assets/plants_local_examples";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateImages() {
  const plants = JSON.parse(await fs.readFile(dataPath, "utf8"));
  await fs.ensureDir(baseOut);

  for (const plant of plants) {
    const { id, name, species } = plant;
    const folder = path.join(baseOut, String(id));
    await fs.ensureDir(folder);

    const filename = slugify(`${name}_${species}`, {
      lower: true,
      strict: true,
      replacement: "_",
    });
    const outPath = path.join(folder, `${filename}.jpg`);

    // Skip if already exists
    if (await fs.pathExists(outPath)) {
      console.log(`🟢 Exists: ${outPath}`);
      continue;
    }

    const prompt = `Scientific botanical poster illustration of ${name} (${species}) — full plant with labeled leaf and flower, watercolor style, white background, minimalistic, natural composition.`;

    try {
      console.log(`🎨 Generating ${id}: ${name}`);
      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });

      const image_base64 = result.data[0].b64_json;
      const buffer = Buffer.from(image_base64, "base64");
      await fs.writeFile(outPath, buffer);
      console.log(`✅ Saved: ${outPath}`);

      await delay(3000); // wait 3s to avoid rate limits
    } catch (err) {
      console.error(`❌ Error for ${name}:`, err.message);
      await delay(5000);
    }
  }

  console.log("🌿 All images generated successfully.");
}

generateImages();
