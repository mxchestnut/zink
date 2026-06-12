/**
 * Optional CORS proxy for PathCompanion live sync — only needed if their
 * API turns out not to send CORS headers for browser fetches.
 *
 * Deploy free on Cloudflare Workers (100k requests/day on the free plan):
 *   npx wrangler deploy workers/pathcompanion-proxy.js --name zink-pc-proxy
 * then set VITE_PC_API to:
 *   https://zink-pc-proxy.<your-subdomain>.workers.dev/?u=<encoded PathCompanion URL>
 *
 * Locked to pathcompanion.com so it can't be abused as an open proxy.
 */
const ALLOWED_HOSTS = new Set(["pathcompanion.com", "api.pathcompanion.com"]);

export default {
  async fetch(request) {
    const target = new URL(request.url).searchParams.get("u");
    if (!target) return new Response("missing ?u=", { status: 400 });

    let upstream;
    try {
      upstream = new URL(target);
    } catch {
      return new Response("bad url", { status: 400 });
    }
    if (!ALLOWED_HOSTS.has(upstream.hostname)) {
      return new Response("host not allowed", { status: 403 });
    }

    const res = await fetch(upstream, { headers: { accept: "application/json" } });
    return new Response(res.body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
