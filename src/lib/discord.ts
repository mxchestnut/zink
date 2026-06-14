import type { RollEntry } from "../types";

const key = (alias: string) => `onee.cloud.discord.${alias}`;

export function getDiscordWebhook(alias: string): string {
  try {
    return window.localStorage.getItem(key(alias)) ?? "";
  } catch {
    return "";
  }
}

export function setDiscordWebhook(alias: string, url: string): void {
  try {
    if (url.trim()) {
      window.localStorage.setItem(key(alias), url.trim());
    } else {
      window.localStorage.removeItem(key(alias));
    }
  } catch {
    // ignore quota errors
  }
}

export async function postRollToDiscord(
  webhookUrl: string,
  entry: RollEntry,
  characterName: string,
  avatarUrl?: string,
): Promise<void> {
  if (!webhookUrl) return;

  const isNat20 = entry.natural === 20;
  const isNat1 = entry.natural === 1;
  const modSign = entry.modifier >= 0 ? "+" : "";
  const rollSuffix = isNat20 ? " ⭐" : isNat1 ? " 💀" : "";

  const color = isNat20 ? 0xf5c518 : isNat1 ? 0xe53e3e : 0x5865f2;

  const embed: Record<string, unknown> = {
    author: {
      name: characterName,
      ...(avatarUrl ? { icon_url: avatarUrl } : {}),
    },
    description: `rolled **${entry.label}** · ${entry.die} ${modSign}${entry.modifier} = **${entry.total}**${rollSuffix}\n-# natural ${entry.natural}`,
    color,
    timestamp: new Date(entry.at).toISOString(),
  };

  const body: Record<string, unknown> = {
    username: characterName,
    embeds: [embed],
  };

  if (avatarUrl) body.avatar_url = avatarUrl;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Don't block the UI if Discord is unreachable
  }
}
