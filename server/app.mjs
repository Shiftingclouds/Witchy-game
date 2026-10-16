import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { HttpError } from './errors.mjs';
import { sendJson } from './http.mjs';
import { createAIRoutes } from './ai/routes.mjs';

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
};

export function createApp({ root, store, apiOnly = false, fetchImpl }) {
  const api = createAIRoutes(store, { fetchImpl });
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (await api(req, res, url)) return;
      if (apiOnly) throw new HttpError(404, 'Use the Vite development server.');
      if (!['GET', 'HEAD'].includes(req.method)) throw new HttpError(405, 'Use GET.');
      let pathname;
      try {
        pathname = decodeURIComponent(url.pathname);
      } catch {
        throw new HttpError(400, 'Invalid path.');
      }
      const target = path.resolve(root, '.' + pathname);
      if (target !== root && !target.startsWith(root + path.sep))
        throw new HttpError(403, 'Not allowed.');
      let file = target;
      try {
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      } catch {
        if (!path.extname(pathname)) file = path.join(root, 'index.html');
        else throw new HttpError(404, 'Not found.');
      }
      let data;
      try {
        data = await readFile(file);
      } catch {
        throw new HttpError(404, 'Not found. Build the application first.');
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control':
          file.endsWith('sw.js') || file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'same-origin',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      if (res.destroyed) return;
      if (!res.headersSent)
        sendJson(res, error instanceof HttpError ? error.status : 500, {
          error: error instanceof HttpError ? error.message : 'The request could not be completed.',
          code: error.code || 'request_failed',
        });
      else res.end();
    }
  });
}
