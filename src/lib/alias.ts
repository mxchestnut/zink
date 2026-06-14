// Alias detection for onee.cloud's public portfolio URLs.
//
// A character can be addressed two ways:
//   • path:      onee.cloud/zink
//   • subdomain: zink.onee.cloud
//
// We read the path on *any* host (not just onee.cloud) so the same routing
// works in local dev and on the raw Cloud Run URL too.

export function normalizeAlias(value?: string): string | undefined {
  const alias = value?.trim().toLowerCase();
  if (!alias) return undefined;
  const normalized = alias.replace(/[^a-z0-9_-]+/g, "");
  return normalized || undefined;
}

export function detectAlias(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const hostParts = window.location.host.toLowerCase().split(".");
  const subdomainAlias =
    hostParts.length === 3 &&
    hostParts[1] === "onee" &&
    hostParts[2] === "cloud" &&
    hostParts[0] !== "www"
      ? hostParts[0]
      : undefined;

  const pathAlias = normalizeAlias(window.location.pathname.replace(/^\/+|\/+$/g, ""));

  // An explicit path wins over the subdomain.
  return pathAlias || subdomainAlias;
}
