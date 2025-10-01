/** Entry point for all prebuild tasks. */
async function prebuild() {
  console.log("🚀 Running prebuild...");
  await generateRecipeList();
  console.log("✅ Prebuild finished.");
}

/** Generates src/generated/recipes.json with a list of recipe names. */
async function generateRecipeList() {
  const recipesDir = "_REZEPTE_";
  const outputFile = "generated/recipes.json";
  const recipes: string[] = [];

  for await (const entry of Deno.readDir(recipesDir)) {
    if (entry.isFile && entry.name.endsWith(".rezept.txt")) {
      const stem = entry.name.replace(/\.rezept\.txt$/, "");
      recipes.push(stem);
    }
  }

  await Deno.mkdir("generated", { recursive: true });
  await Deno.writeTextFile(
    outputFile,
    JSON.stringify(recipes, null, 2) + "\n",
  );

  console.log(`🧾 Wrote ${recipes.length} recipes to ${outputFile}`);
}

// Run the prebuild
if (import.meta.main) {
  await prebuild();
}
