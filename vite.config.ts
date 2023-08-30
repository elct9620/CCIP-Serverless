import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WorkerProxy from './worker/vite-plugin'
import routes from './public/_routes.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WorkerProxy({
      routes: {
        include: routes.include,
        exclude: ['/ui/*', ...routes.exclude],
      },
    }),
  ],
})
