import { computed, inject, Injectable, Signal } from "@angular/core";
import recipes from "../../../generated/recipes.json";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import gitCommit from "../../../generated/git-commit.json";
import { httpResource } from "@angular/common/http";
import RecipeParser from "./recipe-parser";
import init, { gen_recipe_pdf } from "../../../pkg/pdf";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private route = inject(ActivatedRoute);
  private queryParamMap = toSignal(this.route.queryParamMap);

  readonly commit = gitCommit satisfies string;
  readonly all = recipes satisfies string[];

  readonly recipeName = computed(() => {
    let params = this.queryParamMap();
    if (!params) return undefined;
    return params.get("recipe") ?? undefined;
  }) satisfies Signal<string | undefined>;

  private recipeResource = httpResource.text(computed(() => {
    let name = this.recipeName();
    if (!name) return undefined;
    return `_recipes/${name}.rezept.txt?${this.commit}`;
  }));

  readonly recipe = computed(() => {
    let name = this.recipeName();
    let content = this.recipeResource.value();
    if (!name || !content) return undefined;
    return RecipeParser.parse(content, name);
  });

  private wasmURL = `pdf_bg.wasm?${this.commit}`;
  private wasmInit = init(new URL(this.wasmURL, import.meta.url));
  async print() {
    let recipe = this.recipe();
    if (!recipe) return;
    let recipeJSON = JSON.stringify(recipe);
    await this.wasmInit;
    let buffer = gen_recipe_pdf(recipeJSON);
    let blob = new Blob(
      [buffer as Uint8Array<ArrayBuffer>],
      { type: "application/pdf" },
    );
    let url = URL.createObjectURL(blob);
    globalThis.open(url);
    URL.revokeObjectURL(url);
  }
}
