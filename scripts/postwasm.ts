import { copy } from "jsr:@std/fs@1.0.20";

const source = "pkg";
const target = "node_modules/@rezepte.ttst.de/pdf";
await copy(source, target, {overwrite: true});
