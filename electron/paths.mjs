import path from 'node:path';

export const saveDirectory = (userDataPath) => path.join(userDataPath, 'saves');

/** Saves and logs must never land inside the public repository. */
export function assertOutsideRepo(dir, repoRoot) {
  const relative = path.relative(path.resolve(repoRoot), path.resolve(dir));
  const inside =
    relative === '' ||
    (!relative.startsWith('..') && !path.isAbsolute(relative)) ||
    (process.platform === 'win32' &&
      path
        .resolve(dir)
        .toLowerCase()
        .startsWith(path.resolve(repoRoot).toLowerCase() + path.sep));
  if (inside) throw new Error(`Refusing to store private data inside the repository: ${dir}`);
}
