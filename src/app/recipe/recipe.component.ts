import { Component, computed, inject, resource } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { MarkdownFile } from "@dimerapp/markdown";
import { toHtml } from "@dimerapp/markdown/utils";
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: "recipe",
  imports: [KeyValuePipe],
  templateUrl: "./recipe.component.html",
  styleUrl: "./recipe.component.scss",
})
export class RecipeComponent {
  protected service = inject(RecipeService);

  protected preparation = resource({
    params: computed(() => this.service.recipe()?.preparation),
    loader: async ({ params: content }) => {
      let md = new MarkdownFile(content);
      await md.process();
      return toHtml(md).contents;
    },
  });
}
