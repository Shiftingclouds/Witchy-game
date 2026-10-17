/** Desktop saves go through the Electron bridge; a plain browser keeps using localStorage. */
export function platformStorage() {
  if (typeof window !== 'undefined' && window.lanternmere?.storage)
    return window.lanternmere.storage;
  return {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  };
}
