/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

interface RuntimeConfig {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  ENABLE_ADMIN?: string;
  INQUIRY_EMAIL?: string;
  INQUIRY_WHATSAPP_NUMBER?: string;
}

interface Window {
  __RUNTIME_CONFIG__?: RuntimeConfig;
}
