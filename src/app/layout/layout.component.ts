import { Component, effect, inject, model } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { GreeterComponent } from "../greeter/greeter.component";
import { RecipeService } from "../recipe/recipe.service";
import { RecipeComponent } from "../recipe/recipe.component";
import { SidebarState } from "./layout";

@Component({
  selector: "layout",
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    GreeterComponent,
    RecipeComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  protected service = inject(RecipeService);

  readonly sidebarState = model("hidden" as "hidden" | "visible");
  private _sidebarState = effect(() => console.log(this.sidebarState()));
}
