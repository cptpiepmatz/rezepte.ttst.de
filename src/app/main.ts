import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app_/app.config";
import { App } from "./app_/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
