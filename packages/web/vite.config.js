import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // The contact form posts to the API; proxying keeps it same-origin in
      // dev so no CORS entry is needed for :5174.
      '/api': 'http://localhost:4000',
    },
  },
});
