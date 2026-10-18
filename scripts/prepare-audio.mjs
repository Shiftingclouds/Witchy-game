// Copies audio/ (music, ambience, sfx) into public/audio and writes the list the game plays from.
// Any track named in docs/design/SOUND_AND_MUSIC.md that is missing simply stays silent.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE = 'audio';
const OUT = 'public/audio';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const tracks = {};
if (existsSync(SOURCE))
  for (const folder of ['music', 'ambience', 'sfx']) {
    const dir = path.join(SOURCE, folder);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (!['.mp3', '.ogg', '.wav', '.m4a'].includes(ext)) continue;
      cpSync(path.join(dir, file), path.join(OUT, folder, file), { recursive: true });
      tracks[`${folder}/${path.basename(file, ext)}`] = `audio/${folder}/${file}`;
    }
  }
writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ tracks }, null, 2));
console.log(`Audio: ${Object.keys(tracks).length} files ready.`);
