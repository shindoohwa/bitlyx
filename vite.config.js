import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                json: resolve(__dirname, 'json-parser.html'),
                crypto: resolve(__dirname, 'crypto-converter.html'),
                converter: resolve(__dirname, 'base-converter.html'),
            },
        },
    },
});
