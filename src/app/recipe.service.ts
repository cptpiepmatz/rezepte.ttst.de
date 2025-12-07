import { computed, inject, Injectable, Signal } from "@angular/core";
import recipes from "../../generated/recipes.json";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private route = inject(ActivatedRoute);
  private queryParamMap = toSignal(this.route.queryParamMap);

  readonly all = recipes satisfies string[];

  readonly recipeName = computed(() => {
    let params = this.queryParamMap();
    if (!params) return undefined;
    return params.get("recipe") ?? undefined;
  }) satisfies Signal<string | undefined>;

}
