ARG NODE_VERSION
ARG NPM_VERSION
ARG DENO_VERSION
ARG WASM_PACK_VERSION
ARG RUST_TOOLCHAIN_CHANNEL


# Build a wasm-pack binary once so we can reuse it later
FROM rust:1.91-bookworm AS wasm-pack
ARG WASM_PACK_VERSION
RUN cargo install wasm-pack --version ${WASM_PACK_VERSION} --root /


# Build the Rust WASM code
FROM rust:${RUST_TOOLCHAIN_CHANNEL}-bookworm AS wasm

# Bring in cargo config and toolchain overrides early for caching
COPY --link .cargo/ ./.cargo/
COPY --link rust-toolchain.toml .
RUN rustup target add wasm32-unknown-unknown

# First build step: build with a stub pdf lib to warm up dependencies
COPY --link Cargo.toml Cargo.lock ./
RUN mkdir -p src/pdf/
RUN touch src/pdf/lib.rs
RUN cargo build --release --target=wasm32-unknown-unknown

# Second build: now copy the real sources
COPY --link fonts/ ./fonts/
COPY --link logo/ ./logo/
COPY --link src/pdf/ ./src/pdf/
RUN touch src/pdf/lib.rs
RUN cargo build --release --target=wasm32-unknown-unknown

# Run wasm-pack to produce JS bindings and a pkg folder
COPY --from=wasm-pack /bin/wasm-pack ./bin/wasm-pack
RUN wasm-pack build --target=web --release --scope=rezepte.ttst.de --out-name=pdf --out-dir=/pkg


# Generate metadata using Deno
FROM denoland/deno:${DENO_VERSION} AS meta
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*

COPY --link deno.jsonc deno.lock ./
COPY --link scripts/meta.ts ./scripts/meta.ts
COPY --link _recipes/ ./_recipes/
COPY --link .git/ ./.git/
# Generates the "generated" directory
RUN deno run -A scripts/meta.ts


# Build the frontend app
FROM node:${NODE_VERSION}-bookworm AS app
WORKDIR /app

COPY --link package.json package-lock.json ./
RUN npm ci --omit=optional

COPY --from=wasm /pkg/ ./pkg/
COPY --from=meta generated/ ./generated/
COPY --link angular.json tsconfig.json ./
COPY --link logo/ ./logo/
COPY --link public/ ./public/
COPY --link src/app/ ./src/app/
COPY --link _recipes/ ./_recipes/

# Build the Angular app
RUN npm run build --ignore-scripts


# Final tiny server image
FROM sigoden/dufs
WORKDIR /app

# Only ship the built browser assets
COPY --from=app /app/dist/rezepte.ttst.de/browser /app

EXPOSE 5000
ENTRYPOINT [ "dufs", "--render-index", "-b0.0.0.0", "-p5000", "/app" ]
