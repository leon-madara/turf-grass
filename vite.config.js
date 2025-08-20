import {
    defineConfig
} from 'vite';

export default defineConfig({
    base: '/turf-grass/',
    build: {
        rollupOptions: {
            input: {
                index: 'index.html',
                products: 'products.html',
                about: 'about.html',
                contact: 'contact.html',
                'broker/broker': 'broker/broker.html',
            }
        },
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    },
    server: {
        port: 3000,
        open: true
    }
});