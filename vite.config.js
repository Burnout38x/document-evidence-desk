import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Local API uses the same handler as Vercel; no secrets enter the browser bundle.
function localApi() {
  const install = (server) => { server.middlewares.use('/api/answer', async (req, res) => {
    try { const { default: handler } = await import('./api/answer.js'); await handler(req,res); }
    catch { res.statusCode = 503; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({available:false,error:'AI answers are not connected. Evidence search is available.'})); }
  }); };
  return {name:'local-evidence-api',configureServer:install,configurePreviewServer:install};
}
export default defineConfig({plugins:[react(),localApi()]});
