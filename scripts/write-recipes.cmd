@echo off
docker run ^
  --name rezepte.ttst.de ^
  --pull always ^
  --rm ^
  -p 5000:5000 ^
  -v %~dp0..\_recipes:/app/_recipes:ro ^
  ghcr.io/cptpiepmatz/rezepte.ttst.de:latest
