import { Component, inject } from "@angular/core";
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
}
