import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                json: resolve(__dirname, 'json-parser.html'),
                encoder: resolve(__dirname, 'crypto-encoder.html'),
                decoder: resolve(__dirname, 'crypto-decoder.html'),
                converter: resolve(__dirname, 'base-converter.html'),
            },
        },
    },
});
