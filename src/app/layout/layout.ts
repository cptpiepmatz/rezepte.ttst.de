export class SidebarState {
  constructor(public state: "visible" | "hidden" = "hidden") {}

  isVisible() {
    return this.state === "visible";
  }

  toggle() {
    this.state = this.state === "visible" ? "hidden" : "visible";
  }
}
