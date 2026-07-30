// Fetch LinkedIn (bio + experience) via Exa, the same way pirates-repo's Kaustav does.
// Reads EXA_KEY from .env (gitignored). Run: node scripts/fetch_linkedin.mjs
// The KEY stays local — only the printed text gets hand-placed into the site.
import { readFileSync } from "node:fs";

const LINKEDIN = "https://www.linkedin.com/in/vedant-shelkar-5a9a59281/";

// tiny .env reader (no dependency)
function loadEnv() {
  try {
    for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no .env yet */ }
}
loadEnv();

const KEY = process.env.EXA_KEY;
if (!KEY) { console.error("✗ EXA_KEY not found. Add it to about-me/.env as EXA_KEY=..."); process.exit(1); }

async function exa(path, body) {
  const r = await fetch("https://api.exa.ai/" + path, {
    method: "POST",
    headers: { "x-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

// 1) pull the profile page text directly (livecrawl in case it's not cached)
try {
  const c = await exa("contents", { ids: [LINKEDIN], text: { maxCharacters: 8000 }, livecrawl: "always" });
  const txt = c?.results?.[0]?.text?.trim();
  if (txt) { console.log("=== PROFILE (contents) ===\n" + txt + "\n"); }
  else console.log("(contents returned no text — trying search)\n");
} catch (e) { console.log("contents failed:", e.message, "\n"); }

// 2) fallback: search Exa for the person, dump top hits' text
try {
  const s = await exa("search", {
    query: "Vedant Shelkar IIT Madras ML engineer LinkedIn",
    numResults: 5, type: "auto", contents: { text: { maxCharacters: 3000 } },
  });
  for (const r of s?.results ?? []) {
    console.log(`\n=== ${r.title} — ${r.url} ===\n${(r.text || "").trim().slice(0, 3000)}`);
  }
} catch (e) { console.log("search failed:", e.message); }
