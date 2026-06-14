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
): Promise<void> {
  if (!webhookUrl) return;

  const isNat20 = entry.natural === 20;
  const isNat1 = entry.natural === 1;
  const modSign = entry.modifier >= 0 ? "+" : "";

  const color = isNat20 ? 0xf5c518 : isNat1 ? 0xe53e3e : 0x5865f2;
  const title = isNat20
    ? `⭐ ${entry.label} — Natural 20!`
    : isNat1
      ? `💀 ${entry.label} — Natural 1`
      : `🎲 ${entry.label}`;

  const body = {
    username: "OneE",
    embeds: [
      {
        title,
        color,
        fields: [
          { name: "Die", value: entry.die, inline: true },
          {
            name: "Natural",
            value: isNat20 ? `**${entry.natural}** ⭐` : isNat1 ? `**${entry.natural}** 💀` : `${entry.natural}`,
            inline: true,
          },
          { name: "Modifier", value: `${modSign}${entry.modifier}`, inline: true },
          { name: "Total", value: `**${entry.total}**`, inline: true },
        ],
        footer: { text: characterName },
        timestamp: new Date(entry.at).toISOString(),
      },
    ],
  };

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
