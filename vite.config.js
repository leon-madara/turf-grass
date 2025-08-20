import {
    defineConfig
} from 'vite';

export default defineConfig({
    base: '/turf-grass/',
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                products: 'products.html',
                about: 'about.html',
                contact: 'contact.html',
                broker: 'broker/index.html',
            }
        }
    }
});