import * as esbuild from 'esbuild';
import glob from 'glob';
const globSync = glob.sync;
import path from 'path';
import fs from 'fs';

const isProd = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');

// Plugin: resolve require-globify patterns
// Matches: require('./path/*.js', {glob: true}) or require('./path/*.js', {mode: 'expand'})
function requireGlobifyPlugin() {
    return {
        name: 'require-globify',
        setup(build) {
            // Intercept files that contain glob requires and rewrite them
            build.onLoad({filter: /\.(js|jsx)$/}, async (args) => {
                const source = await fs.promises.readFile(args.path, 'utf8');

                // Match require('./path/*.js', {glob: true}) or {mode: 'expand'}
                const globPattern = /require\(\s*['"]([^'"]*\*[^'"]*)['"]\s*,\s*\{[^}]*\}\s*\)/g;
                if (!globPattern.test(source)) return;

                // Reset regex
                globPattern.lastIndex = 0;
                let result = source;

                let match;
                while ((match = globPattern.exec(source)) !== null) {
                    const pattern = match[1];
                    const dir = path.dirname(args.path);
                    const resolved = globSync(pattern, {cwd: dir});

                    if (resolved.length === 0) continue;

                    // Build a map: { './path/file.js': require('./path/file.js') }
                    const entries = resolved.map(f => {
                        const rel = './' + f.replace(/\\/g, '/');
                        return `${JSON.stringify(rel)}: require(${JSON.stringify(rel)})`;
                    });

                    const replacement = `({${entries.join(', ')}})`;
                    result = result.replace(match[0], replacement);
                }

                return {contents: result, loader: args.path.endsWith('.jsx') ? 'jsx' : 'jsx'};
            });
        },
    };
}

// Service worker bundle
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

// Main app bundle
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
    inject: ['browser/buffer-shim.js'],
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

if (isWatch) {
    const LIVERELOAD_PORT = 35729;

    // Tiny SSE server that sends reload events after each rebuild
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

    // Inject livereload client into the bundle
    buildOptions.banner = {
        js: '(() => { if (typeof window !== "undefined") { const es = new EventSource("http://localhost:' + LIVERELOAD_PORT + '/livereload"); es.onmessage = () => window.location.reload(); } })();'
    };

    // Plugin to notify clients after each rebuild
    buildOptions.plugins.push({
        name: 'livereload-notify',
        setup(build) {
            build.onEnd(() => {
                clients.forEach(c => c.write('data: reload\n\n'));
                if (clients.length > 0) {
                    console.log(`[livereload] Reloading ${clients.length} client(s)`);
                }
            });
        },
    });

    const ctx = await esbuild.context(buildOptions);
    const swCtx = await esbuild.context(swBuildOptions);
    await ctx.watch();
    await swCtx.watch();
    console.log(`Watching for changes... (livereload on port ${LIVERELOAD_PORT})`);
} else {
    await Promise.all([
        esbuild.build(buildOptions),
        esbuild.build(swBuildOptions),
    ]);
}
