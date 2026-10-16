import { HttpError } from './errors.mjs';

export function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}

export async function readJson(req, limit = 96_000) {
  if (!req.headers['content-type']?.startsWith('application/json'))
    throw new HttpError(415, 'Use application/json.');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, 'The request is too large.');
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw new HttpError(400, 'Enter a valid JSON request.');
  }
}

export function requireSameOrigin(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site')
    throw new HttpError(403, 'Requests must come from this app.');
  if (req.headers.origin) {
    let origin;
    try {
      origin = new URL(req.headers.origin);
    } catch {
      throw new HttpError(403, 'Invalid request origin.');
    }
    if (origin.host !== req.headers.host)
      throw new HttpError(403, 'Requests must come from this app.');
  }
}

export function createRateLimit({ limit = 10, windowMs = 60_000, maxClients = 2000 } = {}) {
  const clients = new Map();
  return (key) => {
    const now = Date.now();
    for (const [id, times] of clients) if (times.at(-1) <= now - windowMs) clients.delete(id);
    const recent = (clients.get(key) || []).filter((time) => time > now - windowMs);
    if (recent.length >= limit || (!clients.has(key) && clients.size >= maxClients)) {
      throw new HttpError(429, 'Please wait a minute before trying again.', 'rate_limited');
    }
    clients.set(key, [...recent, now]);
  };
}
