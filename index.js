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
const generateHTML = (recipe) => {
  // Ingredients list
  let ingredientsHTML = "<h2>Ingrédients</h2><ul>";
  recipe.ingredients.forEach((ingredient) => {
    ingredientsHTML += `
      <li>
        <img src="./pictures/${ingredient.picture}" alt="${ingredient.name}" />
        ${ingredient.translated_name[0].fr}: ${ingredient.quantity} ${ingredient.unit}
      </li>`;
  });
  ingredientsHTML += "</ul>";

  // Timing information
  const timing = recipe.timing;
  const timingHTML = `
    <h2>Temps</h2>
    <ul>
      <li>Total: ${timing.total.quantity} ${timing.total.unit}</li>
      <li>Préparation: ${timing.preparation.quantity} ${timing.preparation.unit}</li>
      <li>Repos: ${timing.rest.quantity} ${timing.rest.unit}</li>
      <li>Cuisson: ${timing.cooking.quantity} ${timing.cooking.unit}</li>
    </ul>
  `;

  // Preparation steps
  let stepsHTML = "<h2>Étapes</h2><ol>";
  recipe.steps.forEach((step) => {
    stepsHTML += `<li>${step.description}</li>`;
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
