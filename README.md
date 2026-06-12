# Zink — Character Portfolio

A sleek, resume-style portfolio for **Zink** (she/they), nonbinary fem changeling witch of
Ustalav — built for Pathfinder 1e and her sheet on [PathCompanion](https://pathcompanion.com/).

Dark zinc + candlelight-amber theme, Fraunces/Inter type, [react-icons](https://react-icons.github.io/react-icons/)
throughout (zero emojis), and a constellation-style geometric owl — Vesper — keeping watch from
the sidebar and the page margin.

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # static site → dist/
```

## Where the numbers come from

Everything on the page renders from one typed model (`src/types.ts`). Three sources feed it,
in increasing order of freshness — the footer badge shows which one is active:

| Source | What it is |
| --- | --- |
| **snapshot** | `src/data/character.json` — hand-maintained sheet, always works |
| **imported** | `src/data/pathcompanion-raw.json` — saved by `npm run sync`, merged at build |
| **live** | browser re-fetches the sheet on every visit (`VITE_PC_API` in `.env`) |

### Syncing from PathCompanion

Zink's character key (baked into `src/lib/pathcompanion.ts`, override with `PATHCOMPANION_KEY`)
decodes to `{ account: "27C7B3F64FD85592", character: "character13" }`.

PathCompanion publishes no API docs, so:

```bash
npm run sync                          # probes likely endpoints with the key
npm run sync -- --url <endpoint>      # once you know the real one
npm run sync -- --from-file raw.json  # JSON saved by hand from DevTools
```

The guaranteed manual route takes about a minute: open the character on pathcompanion.com,
DevTools → **Network → XHR**, copy the response that contains the sheet, save it as
`src/data/pathcompanion-raw.json`, rebuild.

The tolerant mapper (`harvest()` in `src/lib/pathcompanion.ts`) digs through whatever shape
that JSON has for names, abilities, AC, saves, HP, BAB/CMB/CMD, XP, and languages; anything it
can't confidently find keeps its snapshot value, so a partial match never breaks the page.
Extend `harvest()` once the real field names are known — skills and spell lists are deliberately
left to the snapshot until then. If live browser sync hits a CORS wall, deploy the 30-line
locked-down proxy in `workers/pathcompanion-proxy.js` to Cloudflare Workers (free tier).

## The journal — Ghost or free

The **Field Journal** section reads local entries from `src/data/journal.ts` by default. To make
it a real blog, point it at any [Ghost](https://ghost.org/) instance — copy `.env.example` to
`.env` and fill in:

```ini
VITE_GHOST_URL=https://zink.ghost.io
VITE_GHOST_KEY=<Content API key>   # admin → Settings → Integrations (read-only, safe to ship)
VITE_GHOST_TAG=journal             # optional tag filter
```

Posts then render as journal cards linking to the full entries, with the local entries as an
automatic fallback if Ghost is ever unreachable. Cost options, cheapest first:

| Option | Cost | Notes |
| --- | --- | --- |
| Local entries in the repo | free | edit `src/data/journal.ts`, push, done |
| Self-hosted Ghost (e.g. [PikaPods](https://www.pikapods.com/)) | ~$3/mo | full Ghost editor |
| [Ghost(Pro)](https://ghost.org/pricing/) Starter | $9/mo | zero maintenance |

The site itself is static and hosts **free** — a GitHub Pages workflow is included
(`.github/workflows/deploy.yml`): enable repo **Settings → Pages → Source: GitHub Actions**,
push to `main`, and it ships to `https://<user>.github.io/zink/`. (Netlify/Cloudflare Pages
work too — build command `npm run build`, output `dist`, and drop the `VITE_BASE` env.)

## Customizing

- **Stats** — `src/data/character.json`
- **Backstory & profile blurb** — `src/data/backstory.ts`
- **Journal fallback entries** — `src/data/journal.ts`
- **The owl** — `src/components/GeometricOwl.tsx` (one SVG, reused at three sizes)
- **Palette & fonts** — Tailwind zinc/amber classes and the `@theme` block in `src/index.css`
