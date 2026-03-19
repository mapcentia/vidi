import * as esbuild from 'esbuild';
import glob from 'glob';
const globSync = glob.sync;
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import {execSync} from 'child_process';

const isProd = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');
const isCssOnly = process.argv.includes('--css');

// ---------------------------------------------------------------------------
// Plugin: resolve require-globify patterns
// ---------------------------------------------------------------------------
function requireGlobifyPlugin() {
    return {
        name: 'require-globify',
        setup(build) {
            build.onLoad({filter: /\.(js|jsx)$/}, async (args) => {
                const source = await fs.promises.readFile(args.path, 'utf8');
                const globPattern = /require\(\s*['"]([^'"]*\*[^'"]*)['"]\s*,\s*\{[^}]*\}\s*\)/g;
                if (!globPattern.test(source)) return;
                globPattern.lastIndex = 0;
                let result = source;
                let match;
                while ((match = globPattern.exec(source)) !== null) {
                    const pattern = match[1];
                    const dir = path.dirname(args.path);
                    const resolved = globSync(pattern, {cwd: dir});
                    if (resolved.length === 0) continue;
                    const entries = resolved.map(f => {
                        const rel = './' + f.replace(/\\/g, '/');
                        return `${JSON.stringify(rel)}: require(${JSON.stringify(rel)})`;
                    });
                    const replacement = `({${entries.join(', ')}})`;
                    result = result.replace(match[0], replacement);
                }
                return {contents: result, loader: 'jsx'};
            });
        },
    };
}

// ---------------------------------------------------------------------------
// Task: Compile SCSS
// ---------------------------------------------------------------------------
function buildSass() {
    console.log('[sass] Compiling...');
    execSync('npx sass scss/main.scss scss/main.css --style=expanded --no-source-map', {stdio: 'inherit'});
}

// ---------------------------------------------------------------------------
// Task: Minify and concatenate CSS
// ---------------------------------------------------------------------------
async function buildCss() {
    buildSass();

    console.log('[css] Bundling...');

    // Extensions CSS (scss/main.css + extension CSS)
    const extCssFiles = [
        'scss/main.css',
        ...globSync('public/css/extensions/**/less/*.css'),
    ];
    const extCss = extCssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
    const extMin = await esbuild.transform(extCss, {loader: 'css', minify: true});
    fs.mkdirSync('public/css', {recursive: true});
    fs.writeFileSync('public/css/styles.min.css', extMin.code);

    // All CSS (vendor + app)
    const allCssFiles = [
        'node_modules/bootstrap-icons/font/bootstrap-icons.css',
        'node_modules/leaflet/dist/leaflet.css',
        'public/js/lib/leaflet-draw/leaflet.draw.css',
        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.css',
        'public/js/lib/leaflet.toolbar/leaflet.toolbar.css',
        'public/js/lib/leaflet-measure-path/leaflet-measure-path.css',
        'public/js/lib/leaflet-history/leaflet-history.css',
        'public/js/lib/leaflet-boxzoom/leaflet-boxzoom.css',
        'public/js/lib/Leaflet.extra-markers/css/leaflet.extra-markers.css',
        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.css',
        'public/js/lib/Leaflet.markercluster/MarkerCluster.css',
        'public/js/lib/Leaflet.markercluster/MarkerCluster.Default.css',
        'node_modules/bootstrap-select/dist/css/bootstrap-select.css',
        'node_modules/bootstrap-table/dist/bootstrap-table.css',
        'scss/main.css',
        'public/css/styles.min.css',
    ];
    const allCss = allCssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
    const allMin = await esbuild.transform(allCss, {loader: 'css', minify: true});
    fs.mkdirSync('public/css/build/fonts', {recursive: true});
    fs.writeFileSync('public/css/build/all.min.css', allMin.code);

    // Copy font files referenced by CSS
    for (const font of globSync('node_modules/bootstrap-icons/font/fonts/*')) {
        fs.copyFileSync(font, path.join('public/css/build/fonts', path.basename(font)));
    }

    console.log(`[css] Done (${(allMin.code.length / 1024).toFixed(0)} kB)`);
}

// ---------------------------------------------------------------------------
// Task: Compile Hogan templates
// ---------------------------------------------------------------------------
async function buildTemplates() {
    console.log('[templates] Compiling Hogan...');
    const hogan = (await import('hogan.js')).default;
    const tmplFiles = [
        ...globSync('public/templates/**/*.tmpl'),
        ...globSync('extensions/**/templates/*.tmpl'),
    ];
    let output = 'this["Templates"] = this["Templates"] || {};\n';
    for (const file of tmplFiles) {
        const name = path.basename(file);
        const content = fs.readFileSync(file, 'utf8');
        const compiled = hogan.compile(content, {asString: true});
        output += `this["Templates"]["${name}"] = new Hogan.Template(${compiled});\n`;
    }
    fs.writeFileSync('public/js/templates.js', output);
    console.log(`[templates] ${tmplFiles.length} templates compiled`);
}

// ---------------------------------------------------------------------------
// Task: Minify JS libs (production only)
// ---------------------------------------------------------------------------
async function buildLibs() {
    console.log('[libs] Minifying...');

    const allJsFiles = [
        'node_modules/leaflet/dist/leaflet-src.js',
        'node_modules/proj4/dist/proj4.js',
        'node_modules/proj4leaflet/src/proj4leaflet.js',
        'public/js/bundle.js',
    ];
    const allJs = allJsFiles.map(f => fs.readFileSync(f, 'utf8')).join(';\n');
    const allMin = await esbuild.transform(allJs, {minify: true, sourcemap: true, target: 'es2020'});
    fs.mkdirSync('public/js/build', {recursive: true});
    fs.writeFileSync('public/js/build/all.min.js', allMin.code);
    fs.writeFileSync('public/js/build/all.min.js.map', allMin.map);

    const libFiles = [
        'public/js/lib/localforage/localforage.js',
        'public/js/lib/leaflet-history/leaflet-history.js',
        'public/js/lib/leaflet-boxzoom/leaflet-boxzoom.js',
        'public/js/lib/leaflet-draw/leaflet.draw.js',
        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.js',
        'public/js/lib/Leaflet.utfgrid/L.NonTiledUTFGrid.js',
        'public/js/lib/leaflet-plugins/Bing.js',
        'public/js/lib/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
        'public/js/lib/leaflet-vector-grid/Leaflet.VectorGrid.bundled.min.js',
        'public/js/lib/Leaflet.markercluster/leaflet.markercluster.js',
        'public/js/lib/Leaflet.extra-markers/leaflet.extra-markers.js',
        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.js',
        'public/js/lib/leaflet-simple-map-screenshoter/dist/leaflet-simple-map-screenshoter.js',
        'public/js/lib/leaflet.tilelayer.wmts/leaflet.tilelayer.wmts.src.js',
        'public/js/lib/jquery.canvasResize.js/jquery.canvasResize.js',
        'public/js/lib/jquery.canvasResize.js/jquery.exif.js',
        'public/js/lib/leaflet-snap/leaflet.snap.js',
        'public/js/lib/leaflet-measure-path/leaflet-measure-path.js',
        'public/js/lib/leaflet.editable/Leaflet.Editable.js',
        'public/js/lib/leaflet-geometryutil/leaflet.geometryutil.js',
        'public/js/lib/Path.Drag.js/src/Path.Drag.js',
        'public/js/lib/leaflet-side-by-side/leaflet-side-by-side.js',
        'public/js/lib/Leaflet.NonTiledLayer/NonTiledLayer.js',
        'node_modules/jquery-ui/dist/jquery-ui.js',
        'node_modules/jquery-ui-touch-punch-c/jquery.ui.touch-punch.js',
        'node_modules/handlebars/dist/handlebars.js',
        'public/js/lib/leaflet-dash-flow/L.Path.DashFlow.js',
        'public/js/lib/typeahead.js/typeahead.jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        'node_modules/leaflet.glify/dist/glify-browser.js',
        'node_modules/maplibre-gl/dist/maplibre-gl.js',
        'node_modules/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js',
        'node_modules/bootstrap-table/dist/bootstrap-table.js',
        'node_modules/bootstrap-table/dist/bootstrap-table-locale-all.js',
        'node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js',
        'public/js/lib/tableExport.jquery.plugin/tableExport.js',
    ];
    const libJs = libFiles.map(f => fs.readFileSync(f, 'utf8')).join(';\n');
    const libMin = await esbuild.transform(libJs, {minify: true, target: 'es2020'});
    fs.writeFileSync('public/js/build/libs.min.js', libMin.code);

    console.log(`[libs] all.min.js: ${(allMin.code.length / 1024).toFixed(0)} kB, libs.min.js: ${(libMin.code.length / 1024).toFixed(0)} kB`);
}

// ---------------------------------------------------------------------------
// Task: Prepare assets
// ---------------------------------------------------------------------------
function prepareAssets() {
    fs.copyFileSync('public/index.html.default', 'public/index.html');
    fs.copyFileSync('public/favicon.ico.default', 'public/favicon.ico');
}

// ---------------------------------------------------------------------------
// Task: Process HTML (replace dev scripts with minified in production)
// ---------------------------------------------------------------------------
function processHtml() {
    let html = fs.readFileSync('public/index.html', 'utf8');
    // Replace build blocks: <!-- build:js /path/to/output.js --> ... <!-- /build -->
    html = html.replace(
        /<!--\s*build:js\s+(\S+)\s*-->([\s\S]*?)<!--\s*\/build\s*-->/g,
        (_, outputPath) => `<script src="${outputPath}"></script>`
    );
    fs.writeFileSync('public/index.html', html);
}

// ---------------------------------------------------------------------------
// Task: Cache bust (append content hash to asset references in HTML)
// ---------------------------------------------------------------------------
function cacheBust() {
    const assets = ['js/build/all.min.js', 'js/build/libs.min.js', 'css/build/all.min.css', 'js/templates.js'];
    let html = fs.readFileSync('public/index.html', 'utf8');

    for (const asset of assets) {
        const filePath = path.join('public', asset);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 16);
        const ext = path.extname(asset);
        const base = asset.slice(0, -ext.length);
        const hashed = `${base}.${hash}${ext}`;
        // Copy file with hash name
        fs.copyFileSync(filePath, path.join('public', hashed));
        // Replace reference in HTML
        html = html.replace(new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), hashed);
    }

    fs.writeFileSync('public/index.html', html);
    console.log('[cacheBust] Done');
}

// ---------------------------------------------------------------------------
// Task: Append build hash to version.json
// ---------------------------------------------------------------------------
function appendBuildHash() {
    const jsSource = fs.readFileSync('public/js/build/all.min.js');
    const cssSource = fs.readFileSync('public/css/build/all.min.css');
    const hash = crypto.createHash('md5').update(Buffer.concat([jsSource, cssSource])).digest('hex');
    const versionJSON = JSON.parse(fs.readFileSync('public/version.json', 'utf8'));
    versionJSON.extensionsBuild = hash;
    fs.writeFileSync('public/version.json', JSON.stringify(versionJSON));
    console.log(`[version] Build hash: ${hash}`);
}

// ---------------------------------------------------------------------------
// esbuild options
// ---------------------------------------------------------------------------
const swCacheFile = isProd
    ? './browser/service-worker/cache.production.js'
    : './browser/service-worker/cache.development.js';

const swBuildOptions = {
    entryPoints: ['browser/service-worker/index.js'],
    bundle: true,
    outfile: 'public/service-worker.bundle.js',
    format: 'iife',
    sourcemap: true,
    minify: isProd,
    target: 'es2020',
    platform: 'browser',
    define: {
        'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
        'process.env': '{}',
    },
    alias: {
        'urls-to-cache': swCacheFile,
    },
    external: ['os'],
    plugins: [requireGlobifyPlugin()],
    logLevel: 'info',
};

const buildOptions = {
    entryPoints: ['browser/index.js'],
    bundle: true,
    outfile: 'public/js/bundle.js',
    format: 'iife',
    sourcemap: true,
    minify: isProd,
    target: 'es2020',
    jsx: 'automatic',
    loader: {'.js': 'jsx', '.css': 'css'},
    platform: 'browser',
    define: {
        'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
        'process.env': '{}',
    },
    inject: [],
    alias: {
        '@rjsf/react-bootstrap': './node_modules/@rjsf/react-bootstrap/lib/index.js',
        '@x0k/json-schema-merge/lib/array': './node_modules/@x0k/json-schema-merge/dist/lib/array.js',
        '@x0k/json-schema-merge/dist/lib/array.js': './node_modules/@x0k/json-schema-merge/dist/lib/array.js',
        '@x0k/json-schema-merge': './node_modules/@x0k/json-schema-merge/dist/index.js',
    },
    external: ['os'],
    plugins: [requireGlobifyPlugin()],
    logLevel: 'info',
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// CSS-only mode
if (isCssOnly) {
    await buildCss();
    process.exit(0);
}

// Watch mode
if (isWatch) {
    const LIVERELOAD_PORT = 35729;
    const http = await import('http');
    let clients = [];
    const server = http.createServer((req, res) => {
        if (req.url === '/livereload') {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            });
            clients.push(res);
            req.on('close', () => { clients = clients.filter(c => c !== res); });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
    server.listen(LIVERELOAD_PORT);

    buildOptions.banner = {
        js: '(() => { if (typeof window !== "undefined") { const es = new EventSource("http://localhost:' + LIVERELOAD_PORT + '/livereload"); es.onmessage = () => window.location.reload(); } })();'
    };

    buildOptions.plugins.push({
        name: 'livereload-notify',
        setup(build) {
            build.onEnd(() => {
                clients.forEach(c => c.write('data: reload\n\n'));
                if (clients.length > 0) console.log(`[livereload] Reloading ${clients.length} client(s)`);
            });
        },
    });

    // Initial CSS + templates build
    await buildCss();
    await buildTemplates();

    // Watch SCSS
    fs.watch('scss', {recursive: true}, async (event, filename) => {
        if (filename?.endsWith('.scss')) {
            console.log(`[watch] SCSS changed: ${filename}`);
            try {
                await buildCss();
                clients.forEach(c => c.write('data: reload\n\n'));
            } catch (e) { console.error('[sass]', e.message); }
        }
    });

    // Watch templates
    const tmplDirs = ['public/templates', 'extensions'];
    tmplDirs.forEach(dir => {
        fs.watch(dir, {recursive: true}, (event, filename) => {
            if (filename?.endsWith('.tmpl')) {
                console.log(`[watch] Template changed: ${filename}`);
                try {
                    buildTemplates();
                    clients.forEach(c => c.write('data: reload\n\n'));
                } catch (e) { console.error('[templates]', e.message); }
            }
        });
    });

    const ctx = await esbuild.context(buildOptions);
    const swCtx = await esbuild.context(swBuildOptions);
    await ctx.watch();
    await swCtx.watch();
    console.log(`Watching for changes... (livereload on port ${LIVERELOAD_PORT})`);

// Production build
} else if (isProd) {
    prepareAssets();
    await buildTemplates();
    await Promise.all([
        esbuild.build(buildOptions),
        esbuild.build(swBuildOptions),
    ]);
    await buildCss();
    await buildLibs();
    processHtml();
    cacheBust();
    appendBuildHash();
    console.log('\n✓ Production build complete');

// Dev build
} else {
    prepareAssets();
    await buildTemplates();
    await Promise.all([
        esbuild.build(buildOptions),
        esbuild.build(swBuildOptions),
    ]);
    await buildCss();
    console.log('\n✓ Dev build complete');
}
