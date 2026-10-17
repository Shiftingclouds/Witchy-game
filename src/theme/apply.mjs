import { READING_MODES, themeVariables } from './tokens.mjs';

/** Put a reading mode's tokens on the document so every stylesheet can use --lm-* variables. */
export function applyReadingMode(mode, root = document.documentElement) {
  const chosen = READING_MODES.includes(mode) ? mode : 'lamplight';
  root.dataset.readingMode = chosen;
  for (const [name, value] of Object.entries(themeVariables(chosen)))
    root.style.setProperty(name, value);
}
