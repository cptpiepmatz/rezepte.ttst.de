import { computed, inject, Injectable, Signal } from "@angular/core";
import recipes from "../../generated/recipes.json";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private queryParamMap = toSignal(this.route.queryParamMap);

  private readRecipe = computed(() => {
    let params = this.queryParamMap();
    if (!params) return undefined;
    return params.get("recipe") ?? undefined;
  }) satisfies Signal<string | undefined>;

  private setRecipe(recipe: string): Promise<void> {
    return this.router.navigate([], {
      queryParams: { recipe },
      queryParamsHandling: "merge",
      replaceUrl: true,
    }).then();
  }

  readonly recipe = Object.assign(this.readRecipe, {
    set: this.setRecipe,
    all: recipes,
  });
}
