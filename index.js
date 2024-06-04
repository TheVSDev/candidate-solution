import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Directory helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Paths definitions
const recipePath = join(__dirname, "src/data/recipe.json"); // Path to recipe.json
const templatePath = join(__dirname, "src/template/result-template.html"); // Path to HTML template
const outputPath = join(__dirname, "result.html"); // Path for the output HTML file

// Read and parse the recipe.json file
const recipeData = await readFile(recipePath, "utf8");
const recipe = JSON.parse(recipeData);

console.log(recipe);
console.log(templatePath);
console.log(outputPath);
