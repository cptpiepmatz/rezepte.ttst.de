import { computed, effect, inject, Injectable, Signal } from "@angular/core";
import recipes from "../../../generated/recipes.json";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import gitCommit from "../../../generated/git-commit.json";
import { httpResource } from "@angular/common/http";
import RecipeParser from "./recipe-parser";

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
    return `.recipes/${name}.rezept.txt?${this.commit}`;
  }));

  readonly recipe = computed(() => {
    let name = this.recipeName();
    let content = this.recipeResource.value();
    if (!name || !content) return undefined;
    return RecipeParser.parse(content, name);
  });
}
