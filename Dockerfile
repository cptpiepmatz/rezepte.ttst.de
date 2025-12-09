ARG NODE_VERSION
ARG NPM_VERSION
ARG DENO_VERSION
ARG WASM_PACK_VERSION
ARG RUST_TOOLCHAIN_CHANNEL


FROM rust:1.91-bookworm AS wasm-pack
RUN apt update -y && apt upgrade -y

ARG WASM_PACK_VERSION
RUN cargo install wasm-pack --version ${WASM_PACK_VERSION} --root /


FROM rust:${RUST_TOOLCHAIN_CHANNEL}-bookworm AS wasm
RUN apt update -y && apt upgrade -y

COPY --link .cargo/ ./cargo/
COPY --link rust-toolchain.toml .
RUN rustup target add wasm32-unknown-unknown

COPY --link Cargo.toml Cargo.lock ./
RUN mkdir -p src/pdf/
RUN touch src/pdf/lib.rs
RUN cargo build --release --target=wasm32-unknown-unknown

COPY --link fonts/ ./fonts/
COPY --link logo/ ./logo/
COPY --link src/pdf/ ./src/pdf/
RUN touch src/pdf/lib.rs
RUN cargo build --release --target=wasm32-unknown-unknown

COPY --from=wasm-pack /bin/wasm-pack ./bin/wasm-pack
RUN wasm-pack build --target=web --release --scope=rezepte.ttst.de --out-name=pdf --out-dir=/pkg


FROM denoland/deno:${DENO_VERSION} AS meta
RUN apt update -y && apt upgrade -y
RUN apt install git -y

COPY --link deno.jsonc deno.lock ./ 
COPY --link scripts/meta.ts ./scripts/meta.ts
COPY --link .recipes/ ./.recipes/
COPY --link .git/ ./.git/
RUN deno run -A scripts/meta.ts


FROM node:${NODE_VERSION}-bookworm AS app
WORKDIR /app
RUN apt update -y && apt upgrade -y

COPY --link package.json package-lock.json ./
RUN npm ci --omit=optional

COPY --from=wasm /pkg/ ./pkg/
COPY --from=meta generated/ ./generated/
COPY --link angular.json tsconfig.json ./
COPY --link logo/ ./logo/
COPY --link public/ ./public/
COPY --link src/app/ ./src/app/
COPY --link .recipes/ .recipes/
RUN ls pkg
RUN cat pkg/pdf.d.ts
RUN npm run build --ignore-scripts


FROM sigoden/dufs
WORKDIR /app
COPY --from=app /app/dist/rezepte.ttst.de/browser /app
EXPOSE 5000
ENTRYPOINT [ "dufs", "--render-index", "-b0.0.0.0", "-p5000", "/app" ]
