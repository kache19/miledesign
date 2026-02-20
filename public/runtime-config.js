// Runtime config fallback for static hosts (e.g. Netlify without env var scopes).
// Replace placeholder values and redeploy.
window.__RUNTIME_CONFIG__ = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  ENABLE_ADMIN: '',
  INQUIRY_EMAIL: '',
  INQUIRY_WHATSAPP_NUMBER: ''
};
