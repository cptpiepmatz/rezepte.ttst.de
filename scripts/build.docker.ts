// Usage:
//   deno run -A ./build.docker.ts . 
//   deno run -A ./build.docker.ts -t my-image:latest .

import { parse as parseToml } from "jsr:@std/toml@1.0.11";

type PackageJson = {
  volta?: {
    node?: string;
    npm?: string;
  };
};

type PackageLock = {
  packages?: Record<string, { version?: string }>;
};

type RustToolchain = {
    toolchain?: { channel?: string };
  };

async function readJsonFile<T>(path: string): Promise<T> {
  const text = await Deno.readTextFile(path);
  return JSON.parse(text) as T;
}

async function main() {
  // package.json
  const pkgJson = await readJsonFile<PackageJson>("package.json");
  const nodeVersion = pkgJson.volta?.node;
  const npmVersion = pkgJson.volta?.npm;

  if (!nodeVersion || !npmVersion) {
    console.error(
      "Error: package.json is missing volta.node or volta.npm",
    );
    Deno.exit(1);
  }

  // package-lock.json
  const lockJson = await readJsonFile<PackageLock>("package-lock.json");
  const denoVersion = lockJson.packages?.["node_modules/deno"]?.version;
  const wasmPackVersion = lockJson.packages?.["node_modules/wasm-pack"]?.version;

  if (!denoVersion) {
    console.error(
      'Error: package-lock.json is missing packages["node_modules/deno"].version',
    );
    Deno.exit(1);
  }

  if (!wasmPackVersion) {
    console.error('Error: package-lock.json is missing packages["node_modules/wasm-pack"].version');
    Deno.exit(1);
  }

  // rust-toolchain.toml
  const rustToolchainText = await Deno.readTextFile("rust-toolchain.toml");
  const rustToolchain = parseToml(rustToolchainText) as RustToolchain;
  const rustChannel = rustToolchain.toolchain?.channel;

  if (!rustChannel) {
    console.error(
      "Error: rust-toolchain.toml is missing [toolchain].channel",
    );
    Deno.exit(1);
  }

  // Build args for Docker
  // deno-fmt-ignore
  const buildArgs = [
    "--build-arg", `NODE_VERSION=${nodeVersion}`,
    "--build-arg", `NPM_VERSION=${npmVersion}`,
    "--build-arg", `DENO_VERSION=${denoVersion}`,
    "--build-arg", `WASM_PACK_VERSION=${wasmPackVersion}`,
    "--build-arg", `RUST_TOOLCHAIN_CHANNEL=${rustChannel}`,
  ];

  // Forward any extra args to docker build
  const forwarded = [...Deno.args];

  const cmd = new Deno.Command("docker", {
    args: ["build", ...buildArgs, ...forwarded],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await cmd.output();
  Deno.exit(code);
}

if (import.meta.main) {
  await main();
}
