import { Component, model } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { remixMenuFold2Fill, remixMenuFoldFill } from "@ng-icons/remixicon";
import { SidebarState } from "../layout";
import { RouterLink } from "@angular/router";

@Component({
  selector: "header",
  imports: [NgIconComponent, RouterLink],
  templateUrl: "./header.component.html",
  providers: [provideIcons({ remixMenuFoldFill, remixMenuFold2Fill })],
})
export class HeaderComponent {
  readonly sidebarState = model(new SidebarState());
}
