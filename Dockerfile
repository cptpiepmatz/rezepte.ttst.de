FROM rust:1.76 AS build

WORKDIR /app

# update container
RUN apt update -y
RUN apt upgrade -y

# add rust target so that wasm-pack can use it later on
RUN rustup target add wasm32-unknown-unknown

# install binstall and with that some tooling
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN cargo binstall -y fnm wasm-pack wasm-bindgen-cli

# install node
COPY .node-version .
RUN fnm install
RUN fnm exec npm install -g npm@latest

# install js packages
COPY package.json package-lock.json ./
RUN fnm exec npm ci --include dev

# prebuild dependencies
RUN mkdir -p ./pdf/src
RUN touch ./pdf/src/lib.rs
COPY pdf/Cargo.toml ./pdf/
RUN rustup target list --installed
RUN cd pdf && cargo build --release --target wasm32-unknown-unknown
RUN ls ./pdf

# build pdf wasm package
COPY pdf/ ./pdf/
RUN touch ./pdf/src/lib.rs
#COPY pdf/src/lib.rs pdf/src/lib.rs
RUN ls ./pdf/src
COPY logo.png .
RUN cat ./pdf/src/lib.rs
RUN cd pdf && cargo build --release --target wasm32-unknown-unknown
RUN fnm exec npm run prebuild

# build react frontend
COPY . .
RUN cat ./pdf/src/lib.rs
RUN ls ./pdf/pkg
RUN cat ./pdf/pkg/recipe_pdf.d.ts
RUN fnm exec npm run build


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
