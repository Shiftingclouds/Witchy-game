// Small, explicit constructors keep authored prose independent of the renderer.
export const actor = (id, emotion = 'neutral') => ({ id, emotion });
export const narrate = (id, text, actors = []) => ({ id, text, speaker: null, actors });
export const speak = (id, speaker, emotion, text, listener) => ({
  id,
  text,
  speaker,
  actors: [actor(speaker, emotion), ...(listener ? [listener] : [])],
});
export const section = (id, title, location, beats, period = 0) =>
  beats.map((beat) => ({
    ...beat,
    section: { id, title, location, period },
  }));
export const when = (choice, equals, ...beats) =>
  beats.map((beat) => ({
    ...beat,
    when: { choice, equals },
  }));
export const decide = (id, text, prompt, options, actors = []) => ({
  ...narrate(id, text, actors),
  choice: { prompt, options },
});
