// Build preview statis (satu file HTML) untuk review tanpa server Laravel.
// Pakai: npm run preview:build  → preview/index.html
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = path.join(root, 'resources/js');
const res = await build({
    entryPoints: [path.join(js, 'preview/main.tsx')],
    bundle: true, minify: true, write: false, format: 'iife', target: 'es2020', jsx: 'automatic',
    alias: { '@inertiajs/react': path.join(js, 'preview/inertia-shim.tsx'), '@': js },
    define: { 'process.env.NODE_ENV': '"production"', __PREVIEW__: 'true' },
    nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
    logLevel: 'warning',
});
const font = (f) => readFileSync(path.join(root, 'public/fonts', f)).toString('base64');
const css = readFileSync(path.join(root, 'resources/css/app.css'), 'utf8')
    .replace("url('/fonts/Geist-Variable.woff2')", `url(data:font/woff2;base64,${font('Geist-Variable.woff2')})`)
    .replace("url('/fonts/GeistMono-Regular.woff2')", `url(data:font/woff2;base64,${font('GeistMono-Regular.woff2')})`);
// Tanpa <html>/<head>/<body>: halaman ini juga dipublikasikan sebagai Artifact yang membungkusnya sendiri.
const html = `<title>Dashboard TM</title>
<script>document.documentElement.lang='id';try{const t=localStorage.getItem('dtm-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<style>${css}</style>
<div id="app"></div>
<script>${res.outputFiles[0].text.replace(/<\/script/g, '<\\/script')}</script>
`;
mkdirSync(path.join(root, 'preview'), { recursive: true });
// artifact.html: isi saja (dibungkus oleh Artifact). index.html: dokumen lengkap untuk dibuka langsung.
writeFileSync(path.join(root, 'preview/artifact.html'), html);
writeFileSync(path.join(root, 'preview/index.html'), `<!doctype html>\n<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>\n${html}</body></html>\n`);
console.log(`preview/index.html + artifact.html ${(html.length / 1024).toFixed(0)} KB`);
