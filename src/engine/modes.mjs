// The four ways to play. Guided builds on the Book reader; the Open World (sandbox) builds on Live the world.
export const MODES = ['book', 'live', 'guided', 'sandbox'];
export const isBookLike = (mode) => mode === 'book' || mode === 'guided';
export const isLiveLike = (mode) => mode === 'live' || mode === 'sandbox';
export const isAiMode = (mode) => mode === 'guided' || mode === 'sandbox';
