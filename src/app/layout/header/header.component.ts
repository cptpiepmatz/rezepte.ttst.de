import { Component, model } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { remixCloseLargeFill, remixMenuFill } from "@ng-icons/remixicon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "header",
  imports: [NgIconComponent, RouterLink],
  templateUrl: "./header.component.html",
  providers: [provideIcons({ remixMenuFill, remixCloseLargeFill })],
})
export class HeaderComponent {
  readonly sidebarState = model("visible" as "visible" | "hidden");
  protected toggleSidebar() {
    this.sidebarState.update((state) => {
      switch (state) {
        case "visible":
          return "hidden";
        case "hidden":
          return "visible";
      }
    });
  }
}
