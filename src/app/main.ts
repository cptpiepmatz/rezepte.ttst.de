import {
  type ApplicationConfig,
  inject,
  Injectable,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { bootstrapApplication, Title } from "@angular/platform-browser";
import {
  provideRouter,
  RouterStateSnapshot,
  TitleStrategy,
} from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";

@Injectable()
class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly mainTitle = "rezepte.ttst.de";

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let recipe = snapshot.root.queryParamMap.get("recipe");
    if (!recipe) return this.title.setTitle(this.mainTitle);
    this.title.setTitle(`${recipe} - ${this.mainTitle}`);
  }
}

const config: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};

bootstrapApplication(LayoutComponent, config).catch((err) =>
  console.error(err)
);
