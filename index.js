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
  "</head>",
  `  <link rel="stylesheet" href="./src/style/style.css" />
  </head>`
);
templateHTML = templateHTML.replace(
  "<h1>Recette de cannelés</h1>",
  `
      <div class="title">
        <h1>Recette de cannelés</h1>
      </div>`
);

const generateHTML = (recipe) => {
  // Ingredients list
  let ingredientsHTML = ` 
      <div class="subtitle">
        <h2>Ingrédients</h2>
      </div>
      <div class="ingredients">`;
  recipe.ingredients.forEach((ingredient) => {
    ingredientsHTML += `
        <div class="ingredient">
          <img src="./pictures/${ingredient.picture}" alt="${ingredient.name}" class="img" />
          <br />
          <span class="ingredient-details"><strong>${ingredient.translated_name[0].fr}</strong>: ${ingredient.quantity} ${ingredient.unit}</span>
        </div>`;
  });
  ingredientsHTML += `
      </div>`;

  // Timing information
  const timing = recipe.timing;
  const timingHTML = `
      <div class="subtitle">
        <h2>Temps</h2>
      </div>
      <ul class="list">
        <li class="list-item">Total: ${timing.total.quantity} ${timing.total.unit}</li>
        <li class="list-item">Préparation: ${timing.preparation.quantity} ${timing.preparation.unit}</li>
        <li class="list-item">Repos: ${timing.rest.quantity} ${timing.rest.unit}</li>
        <li class="list-item">Cuisson: ${timing.cooking.quantity} ${timing.cooking.unit}</li>
      </ul>
  `;

  // Preparation steps
  let stepsHTML = `
      <div class="subtitle">
        <h2>Préparation</h2>
      </div>
      <div class="steps">`;
  recipe.steps.forEach((step, index) => {
    stepsHTML += `
        <div class="step">
          <div class="step-title"><strong>ÉTAPE ${index + 1}</strong></div>
          <div class="step-description">${step.description}</div>
        </div>`;
  });
  stepsHTML += `
      </div>`;

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
