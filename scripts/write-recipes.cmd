@echo off
docker run ^
  --pull=always ^
  --rm ^
  -p 5000:5000 ^
  -v %~dp0..\.recipes:/app/.recipes:ro ^
  ghcr.io/cptpiepmatz/rezepte.ttst.de:latest
