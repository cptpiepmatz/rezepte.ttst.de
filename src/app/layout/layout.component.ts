import { Component, inject } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { GreeterComponent } from "../greeter/greeter.component";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "layout",
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    GreeterComponent,
  ],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  protected service = inject(RecipeService);
}
