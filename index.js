import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Directory helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Paths definitions
const recipePath = join(__dirname, "src/data/recipe.json"); // Path to recipe.json
const templatePath = join(__dirname, "src/template/result-template.html"); // Path to HTML template
const outputPath = join(__dirname, "result.html"); // Path for the output HTML file

// Read files
const recipeData = await readFile(recipePath, "utf8");
let templateHTML = await readFile(templatePath, "utf8");

const recipe = JSON.parse(recipeData);
templateHTML = templateHTML.replace(
  "<h1>Recette de cannelés</h1>",
  '<h1 class="title">Recette de cannelés</h1>'
);

const generateHTML = (recipe) => {
  // Ingredients list
  let ingredientsHTML =
    '<h2 class="subtitle">Ingrédients</h2><ul class="list unordered-list">';
  recipe.ingredients.forEach((ingredient) => {
    ingredientsHTML += `
      <li class="list-item">
        <img src="./pictures/${ingredient.picture}" alt="${ingredient.name}" class="img" />
        ${ingredient.translated_name[0].fr}: ${ingredient.quantity} ${ingredient.unit}
      </li>`;
  });
  ingredientsHTML += "</ul>";

  // Timing information
  const timing = recipe.timing;
  const timingHTML = `
    <h2 class="subtitle">Temps</h2>
    <ul class="list unordered-list">
      <li class="list-item">Total: ${timing.total.quantity} ${timing.total.unit}</li>
      <li class="list-item">Préparation: ${timing.preparation.quantity} ${timing.preparation.unit}</li>
      <li class="list-item">Repos: ${timing.rest.quantity} ${timing.rest.unit}</li>
      <li class="list-item">Cuisson: ${timing.cooking.quantity} ${timing.cooking.unit}</li>
    </ul>
  `;

  // Preparation steps
  let stepsHTML =
    '<h2 class="subtitle">Étapes</h2><ol class="list ordered-list">';
  recipe.steps.forEach((step) => {
    stepsHTML += `<li class="list-item">${step.description}</li>`;
  });
  stepsHTML += "</ol>";

  return `
    ${ingredientsHTML}
    ${timingHTML}
    ${stepsHTML}
  `;
};

// Generate the HTML file
const recipeHTML = generateHTML(recipe);
const finalHTML = templateHTML.replace("REPLACEME", recipeHTML);
await writeFile(outputPath, finalHTML, "utf8");

console.log("HTML file generated successfully.");
