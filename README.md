## Docker Befehle
Docker Images bauen:
```shell
docker build --target build -t rezepte.ttst.de/build .
docker build --target edit -t rezepte.ttst.de/edit .
```

Docker Container starten zum Bearbeiten:
```shell
docker run -p 3000:3000 -v {PROJECT_DIR}/_REZEPTE_:/app/_REZEPTE_:ro -v {PROJECT_DIR}/_REZEPTE_:/app/build/_REZEPTE_:ro rezepte.ttst.de/edit
```
