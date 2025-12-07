import { Component, computed, inject, resource } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { MarkdownFile } from "@dimerapp/markdown";
import { toHtml } from "@dimerapp/markdown/utils";

@Component({
  selector: "recipe",
  imports: [],
  templateUrl: "./recipe.component.html",
})
export class RecipeComponent {
  protected service = inject(RecipeService);

  protected preparation = resource({
    params: computed(() => this.service.recipe()?.preparation),
    loader: async ({params: content}) => {
      let md = new MarkdownFile(content);
      await md.process();
      return toHtml(md).contents;
    }
  });
}
