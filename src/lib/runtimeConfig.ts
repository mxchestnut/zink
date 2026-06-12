interface RuntimeConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

export const runtimeConfig: RuntimeConfig =
  typeof window !== "undefined" && window.__RUNTIME_CONFIG__ ? window.__RUNTIME_CONFIG__ : {};
