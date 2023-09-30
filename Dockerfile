FROM rust:1.72 AS build

WORKDIR /app
COPY . .

RUN apt update -y
RUN apt upgrade -y

RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall -y fnm wasm-pack
RUN fnm install
RUN bash -c "eval \"$(fnm env --use-on-cd)\" && npm ci"
RUN bash -c "eval \"$(fnm env --use-on-cd)\" && npm run build"

CMD ["bash", "-c", "eval \"$(fnm env --use-on-cd)\" && npm run build"]


FROM build AS edit

RUN apt install -y debian-keyring debian-archive-keyring apt-transport-https
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | \
    gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | \
    tee /etc/apt/sources.list.d/caddy-stable.list
RUN apt update -y
RUN apt install -y caddy

RUN apt install -y php-common libapache2-mod-php php-cli

CMD ["bash", "-c", "eval \"$(fnm env --use-on-cd)\" && npm start"]
