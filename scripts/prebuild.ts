/** Entry point for all prebuild tasks. */
async function prebuild() {
  console.log("🚀 Running prebuild...");
  await generateRecipeList();
  await writeGitCommit();
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

/** Writes the current git commit hash to generated/git-commit.txt. */
async function writeGitCommit() {
  const cmd = new Deno.Command("git", { args: ["rev-parse", "HEAD"] });
  const { stdout } = await cmd.output();
  const commit = new TextDecoder().decode(stdout).trim();

  await Deno.mkdir("generated", { recursive: true });
  await Deno.writeTextFile("generated/git-commit.json", `"${commit}"\n`);

  console.log(`📦 Wrote git commit ${commit}`);
}

// Run the prebuild
if (import.meta.main) {
  await prebuild();
}
