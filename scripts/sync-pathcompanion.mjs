#!/usr/bin/env node
/**
 * Pull Zink's sheet from PathCompanion and save it for the site to use.
 *
 *   npm run sync                      probe likely endpoints with the key
 *   npm run sync -- --url <url>       fetch one exact endpoint (supports
 *                                     {key} {account} {character} tokens)
 *   npm run sync -- --from-file x.json  import a saved response
 *
 * PathCompanion is a PlayFab-backed app (no public REST API), so probing is
 * best-effort. The reliable manual route takes about a minute:
 *   1. open your character on pathcompanion.com, DevTools → Network → Fetch/XHR
 *   2. select the large "GetUserData" response → right-click → Copy response
 *   3. save it to a file, then:  npm run sync -- --from-file <that file>
 * The importer auto-detects the PlayFab GetUserData envelope and inflates the
 * character from data.Data.<slot>.Value → { Data: <base64 zlib>, Version }.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const KEY =
  process.env.PATHCOMPANION_KEY ??
  "eyJhY2NvdW50IjoiMjdDN0IzRjY0RkQ4NTU5MiIsImNoYXJhY3RlciI6ImNoYXJhY3RlcjEzIn0=";

const { account, character } = JSON.parse(Buffer.from(KEY, "base64").toString("utf8"));
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "pathcompanion-raw.json");

const fill = (template) =>
  template
    .replaceAll("{key}", encodeURIComponent(KEY))
    .replaceAll("{account}", account)
    .replaceAll("{character}", character);

const CANDIDATES = [
  "https://pathcompanion.com/api/character?key={key}",
  "https://pathcompanion.com/api/character/{key}",
  "https://pathcompanion.com/api/characters/{account}/{character}",
  "https://pathcompanion.com/api/v1/character?key={key}",
  "https://pathcompanion.com/api/share/{key}",
  "https://pathcompanion.com/api/export?key={key}",
  "https://pathcompanion.com/api/integration/character?key={key}",
  "https://api.pathcompanion.com/character?key={key}",
  "https://pathcompanion.com/share/{key}.json",
  "https://pathcompanion-default-rtdb.firebaseio.com/accounts/{account}/characters/{character}.json",
  "https://pathcompanion.firebaseio.com/accounts/{account}/characters/{character}.json",
  "https://path-companion-default-rtdb.firebaseio.com/accounts/{account}/characters/{character}.json",
];

async function tryFetch(url) {
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { url, status: res.status };
    const text = await res.text();
    const json = JSON.parse(text); // throws → caught below
    if (json === null || text.length < 50) return { url, status: res.status, note: "empty" };
    return { url, status: res.status, json };
  } catch (err) {
    return { url, error: err.message?.split("\n")[0] ?? String(err) };
  }
}

/**
 * PathCompanion stores characters in PlayFab "UserData". A Client/GetUserData
 * response wraps the sheet as data.Data.<slot>.Value — itself a JSON string of
 * { Data: <base64 zlib>, Version }. Detect that shape and inflate it; pass
 * anything else through untouched so plain exports still import.
 */
function decodePlayFab(json) {
  const data = json?.data?.Data ?? json?.Data;
  if (!data || typeof data !== "object") return json;
  const slots = [character, ...Object.keys(data).filter((k) => k !== character)];
  for (const slot of slots) {
    const value = data[slot]?.Value ?? data[slot];
    if (typeof value !== "string") continue;
    try {
      const inner = JSON.parse(value);
      if (typeof inner?.Data !== "string") continue;
      const decoded = JSON.parse(inflateSync(Buffer.from(inner.Data, "base64")).toString("utf8"));
      console.log(`  decoded PlayFab UserData["${slot}"] (zlib, v${inner.Version ?? "?"})`);
      return decoded;
    } catch {
      // not the compressed-character shape under this slot — keep looking
    }
  }
  return json;
}

async function save(rawJson, from) {
  const json = decodePlayFab(rawJson);
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(json, null, 2));
  console.log(`\n✓ saved ${OUT}`);
  console.log(`  source: ${from}`);
  console.log("  Rebuild the site and the footer badge flips to “synced”.");
  console.log("  Fields the mapper can't place keep their snapshot values —");
  console.log("  extend harvest() in src/lib/pathcompanion.ts as needed.");
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const fromFile = flag("--from-file");
const exactUrl = flag("--url");

if (fromFile) {
  const json = JSON.parse(await readFile(fromFile, "utf8"));
  await save(json, fromFile);
} else if (exactUrl) {
  const result = await tryFetch(fill(exactUrl));
  if (result.json) await save(result.json, result.url);
  else {
    console.error(`✗ ${result.url} → ${result.status ?? result.error}`);
    process.exit(1);
  }
} else {
  console.log(`Probing PathCompanion for account ${account}, ${character}…\n`);
  let hit;
  for (const candidate of CANDIDATES) {
    const result = await tryFetch(fill(candidate));
    const status = result.json ? "✓ JSON" : (result.status ?? result.error);
    console.log(`  ${result.json ? "✓" : "·"} ${candidate}\n      → ${status}`);
    if (result.json && !hit) hit = result;
  }
  if (hit) {
    await save(hit.json, hit.url);
    console.log(`\nTip: set VITE_PC_API="${hit.url.replace(encodeURIComponent(KEY), "{key}")}"`);
    console.log("in .env to enable live in-browser sync as well.");
  } else {
    console.log("\nNo endpoint answered with JSON. Manual route (≈1 minute):");
    console.log("  1. open the character on pathcompanion.com");
    console.log("  2. DevTools → Network → XHR, find the character JSON response");
    console.log("  3. save it as src/data/pathcompanion-raw.json");
    console.log("     (or: npm run sync -- --from-file <saved.json>)");
    process.exit(1);
  }
}
