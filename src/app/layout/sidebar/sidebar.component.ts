import { Component, inject, model } from "@angular/core";
import { RecipeService } from "../../recipe/recipe.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "sidebar",
  imports: [RouterLink],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  protected service = inject(RecipeService);
  protected window = globalThis.window;

  readonly state = model("hidden" as "hidden" | "visible");
}
