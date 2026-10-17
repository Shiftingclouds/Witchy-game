// Gives the Windows .exe its icon once ChatGPT's lantern-icon.png arrives: electron-builder picks up build/icon.png.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';

if (existsSync('art/lantern-icon.png')) {
  mkdirSync('build', { recursive: true });
  copyFileSync('art/lantern-icon.png', 'build/icon.png');
  console.log('App icon: art/lantern-icon.png');
} else console.log('App icon: not yet received (art/lantern-icon.png); using the default.');
