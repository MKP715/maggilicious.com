import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// If deploying to https://<user>.github.io/maggilicious.com/
export default defineConfig({
plugins: [react()],
base: '/maggilicious.com/',
})


// If you switch to a custom domain (CNAME), change base to '/'
