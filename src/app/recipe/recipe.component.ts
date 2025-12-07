import { Component, computed, inject, resource } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { KeyValuePipe } from "@angular/common";
import markdownit from "markdown-it";

@Component({
  selector: "recipe",
  imports: [KeyValuePipe],
  templateUrl: "./recipe.component.html",
  styleUrl: "./recipe.component.scss",
})
export class RecipeComponent {
  protected service = inject(RecipeService);

  protected preparation = computed(() => {
    let raw = this.service.recipe()?.preparation;
    if (!raw) return undefined;
    let md = markdownit();
    return md.render(raw);
  });
}
