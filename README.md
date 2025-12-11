<div align="center">
<a target="_blank" href="https://rezepte.ttst.de"><picture>
  <source srcset="./logo/logo_invert.png" media="(prefers-color-scheme: dark)">
  <source srcset="./logo/logo.png" media="(prefers-color-scheme: light)">
  <img src="./logo/logo.png" alt="rezepte.ttst.de Logo">
</picture>
</a>

<p>
  <hr>
  <b>Rezepte der Familie Hesse</b>
</p>
</div>

<br>

<div align="center">

[![License](https://img.shields.io/badge/license-PolyForm--Strict--1.0.0-D73A49?style=for-the-badge)](./LICENSE)
[![Angular Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcptpiepmatz%2Frezepte.ttst.de%2Frefs%2Fheads%2Fmain%2Fpackage-lock.json&query=packages.node_modules%2F%40angular%2Fcli.version&prefix=v&style=for-the-badge&logo=angular&label=angular&color=e91e63)](https://angular.dev)
[![Node Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcptpiepmatz%2Frezepte.ttst.de%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=volta.node&prefix=v&style=for-the-badge&logo=nodedotjs&label=node&color=5FA04E)](https://nodejs.org)
[![Deno Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcptpiepmatz%2Frezepte.ttst.de%2Frefs%2Fheads%2Fmain%2Fpackage-lock.json&query=packages.node_modules%2Fdeno.version&prefix=v&style=for-the-badge&logo=deno&label=deno&color=70ffaf)](https://deno.com)
[![Typescript Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcptpiepmatz%2Frezepte.ttst.de%2Frefs%2Fheads%2Fmain%2Fpackage-lock.json&query=packages.node_modules%2Ftypescript.version&prefix=v&style=for-the-badge&logo=typescript&label=TypeScript&color=3178C6)](https://typescriptlang.org)
[![Rust](https://img.shields.io/badge/dynamic/toml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcptpiepmatz%2Frezepte.ttst.de%2Frefs%2Fheads%2Fmain%2Frust-toolchain.toml&query=toolchain.channel&prefix=v&style=for-the-badge&logo=rust&label=rust&color=D34516)](https://rust-lang.org)

</div>

## Lokal starten

Um die Seite lokal zu bauen, sollte man [Volta](https://volta.sh) nutzen.  
So ist sichergestellt, dass die korrekte Node Version installiert wird.  
Außerdem braucht man [rustup](https://rustup.rs), damit die passende Rust 
Version installiert wird. 
Ich kann nicht garantieren, dass andere Versionen funktionieren, die nicht 
angepinnt sind.

Wenn alles eingerichtet ist:

```bash
npm install
npm start
```

Das startet die Seite im Entwicklungsmodus.

## Docker Variante

Wer Docker installiert hat, kann die Seite auch ohne lokalen Build starten:

```
scripts/write-recipe.bat
```

Das Script fährt die Seite direkt hoch.
Rezepte tauchen in der Sidebar dann nicht auf, man muss sie also per Query 
Parameter angeben.

## Rezepte schreiben

Alle Rezepte liegen im Ordner `_recipes`.
Dort gibt es eine [README](./_recipes/README.md), die erklärt, wie ein Rezept 
aufgebaut ist.
Für Details einfach dorthin wechseln.

## Lizenz

Dieses Projekt nutzt die PolyForm Strict Lizenz.
Der Code ist einsehbar, aber nicht für kommerzielle Nutzung gedacht.
Wer das Projekt weiterverwenden will, sollte die Lizenz einmal komplett lesen.
