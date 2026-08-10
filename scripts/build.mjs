/**
 * Production build wrapper for Capacitor / Vercel.
 * Temporarily moves the dev-only `/gallery` App Router folder out of `src/app`
 * so `output: "export"` never emits gallery HTML/JS into `out/` (shipped in iOS).
 * Restores the folder afterward so `npm run dev` keeps working.
 */
import { spawnSync } from "node:child_process";
import { access, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = path.join(root, "src", "app", "gallery");
const stashDir = path.join(root, ".next-dev-stash", "gallery");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function stashGallery() {
  if (!(await exists(galleryDir))) return false;
  await rm(stashDir, { recursive: true, force: true });
  await mkdir(path.dirname(stashDir), { recursive: true });
  await rename(galleryDir, stashDir);
  return true;
}

async function restoreGallery() {
  if (!(await exists(stashDir))) return;
  await rm(galleryDir, { recursive: true, force: true });
  await rename(stashDir, galleryDir);
  await rm(path.dirname(stashDir), { recursive: true, force: true }).catch(
    () => undefined,
  );
}

const stashed = await stashGallery();
let status = 1;
try {
  const result = spawnSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  status = result.status ?? 1;
} finally {
  if (stashed) {
    await restoreGallery();
  }
}

process.exit(status);
