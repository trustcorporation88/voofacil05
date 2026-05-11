import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const manifestPath = path.join(process.cwd(), "pwa-assets", "manifest.webmanifest");
  const manifest = await readFile(manifestPath, "utf8");

  return new Response(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

