import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (API_KEY) depuis le système (Netlify)
  // Fix: Use '.' instead of process.cwd() to avoid TS error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Rend la clé disponible dans le code client de manière sécurisée lors du build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});