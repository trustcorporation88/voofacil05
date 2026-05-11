import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const iconPath = path.join(process.cwd(), "pwa-assets", "icons", "icon-192.png");
  const icon = await readFile(iconPath);

  return new Response(icon, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

