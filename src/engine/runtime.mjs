/**
 * A deterministic command dispatcher. Systems receive an isolated draft and may
 * mutate it; returning false discards the entire command. No storage, network,
 * random numbers, or wall-clock time belong in a gameplay system.
 *
 * @param {{id: string, commands: Record<string, Function>}[]} systems
 * @param {{prepare?: Function}} options
 */
export function createEngine(systems, { prepare = () => {} } = {}) {
  const commands = new Map();
  const ids = new Set();
  for (const system of systems) {
    if (!system.id || ids.has(system.id)) throw new Error('Duplicate or missing system ID.');
    ids.add(system.id);
    for (const [name, handler] of Object.entries(system.commands)) {
      if (commands.has(name) || typeof handler !== 'function') {
        throw new Error(`Invalid or duplicate command: ${name}`);
      }
      commands.set(name, handler);
    }
  }
  return Object.freeze({
    systems: Object.freeze([...ids]),
    commands: Object.freeze([...commands.keys()]),
    transition(previous, action) {
      if (!previous || !action || typeof action !== 'object' || Array.isArray(action))
        return previous;
      const handler = commands.get(action.type);
      if (!handler) return previous;
      const draft = structuredClone(previous);
      prepare(draft);
      return handler(draft, action) === false ? previous : draft;
    },
  });
}
