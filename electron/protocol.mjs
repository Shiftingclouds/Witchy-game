import path from 'node:path';

const ORIGIN = 'app://lanternmere';

/** Map an app:// request to a file inside dist, or null when it would leave dist. */
export function resolveAppPath(distDir, requestUrl) {
  if (typeof requestUrl !== 'string' || !requestUrl.startsWith(ORIGIN + '/')) return null;
  let pathname = requestUrl.slice(ORIGIN.length).split(/[?#]/)[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const segments = pathname.split(/[\/]+/).filter(Boolean);
  if (segments.some((s) => s === '..' || s === '.' || s.includes(':') || s.includes('\0')))
    return null;
  const root = path.resolve(distDir);
  const last = segments.at(-1);
  if (!last || !path.extname(last)) return path.join(root, 'index.html');
  const target = path.join(root, ...segments);
  return target.startsWith(root + path.sep) ? target : null;
}
