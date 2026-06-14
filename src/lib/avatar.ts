import { supabase } from "./supabase";

const BUCKET = "avatars";
const avatarPath = (alias: string) => `${alias}/avatar`;

export function getAvatarPublicUrl(alias: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(avatarPath(alias));
  return data.publicUrl;
}

export async function uploadAvatar(alias: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(avatarPath(alias), file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "no-cache",
  });
  if (error) throw error;
  // Cache-bust the URL so the new image appears immediately.
  return `${getAvatarPublicUrl(alias)}?v=${Date.now()}`;
}
