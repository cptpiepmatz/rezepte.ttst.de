import { Component } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
	selector: "layout",
	imports: [HeaderComponent, SidebarComponent, FooterComponent],
	templateUrl: "./layout.component.html",
})
export class LayoutComponent {}
