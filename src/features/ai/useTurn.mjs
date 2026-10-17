import { useCallback, useEffect, useRef, useState } from 'react';
import { askClaude, cancelClaude } from '../../ai/claude.mjs';
import { buildTurnContext } from '../../ai/context.mjs';
import { replySchema, validateReply } from '../../ai/contract.mjs';
import { needsChronicle, chronicleRequest, chronicleAction } from '../../ai/memory.mjs';

/**
 * One exchange with the storyteller: build context → ask Claude → validate (retrying once with the
 * problems listed) → dispatch ai-turn. Failures leave the save unchanged and keep the player's words.
 * A stopped request's late answer is ignored; actions carry the mode so they never land in another save.
 */
export function useTurn({ game, act, mode }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const last = useRef(null);
  const active = useRef(null);

  const send = useCallback(
    async (text, { focus = {}, decision = null, onReply } = {}) => {
      const words = String(text || '').trim();
      if (!words || busy) return null;
      const id = crypto.randomUUID();
      active.current = id;
      last.current = { text: words, options: { focus, decision, onReply } };
      setBusy(true);
      setError(null);
      const stale = () => active.current !== id;
      try {
        const context = buildTurnContext({
          game,
          mode,
          input: words,
          focus: { ...focus, decision },
        });
        const schema = replySchema(mode, decision ? { decision } : undefined);
        let prompt = context.prompt;
        let validated = null;
        const usable = (v) => v?.reply && (!decision || v.reply.mappedOption);
        for (let attempt = 0; attempt < 2 && !usable(validated); attempt++) {
          const result = await askClaude({
            id: attempt ? id + '-again' : id,
            system: context.system,
            prompt,
            schema,
            purpose: decision ? 'housekeeping' : 'story',
          });
          if (stale()) return null;
          if (!result.ok) {
            setError(result.error);
            return null;
          }
          validated = validateReply(result.data, { game, mode, decision });
          if (!usable(validated))
            prompt = `${context.prompt}\n\n# YOUR LAST REPLY COULD NOT BE USED\n${validated.errors.join('\n')}\nPlease answer again, following the rules.`;
        }
        if (!usable(validated)) {
          setError('invalid');
          return null;
        }
        last.current = null;
        onReply?.(validated.reply);
        act({
          type: 'ai-turn',
          mode,
          requestId: id,
          player: words,
          reply: validated.reply,
          section: focus.sectionId,
        });
        return validated.reply;
      } catch {
        if (!stale()) setError('invalid');
        return null;
      } finally {
        if (!stale()) {
          active.current = null;
          setBusy(false);
        }
      }
    },
    [busy, game, mode, act],
  );

  const retry = useCallback(() => {
    if (last.current) return send(last.current.text, last.current.options);
  }, [send]);
  /** Stop waiting: the request is cancelled, its answer (if any) ignored, the words kept. */
  const cancel = useCallback(() => {
    const id = active.current;
    if (!id) return;
    active.current = null;
    cancelClaude(id);
    cancelClaude(id + '-again');
    setBusy(false);
    setError('cancelled');
  }, []);
  return { busy, error, send, retry, cancel };
}

/**
 * Quietly folds older moments into the chronicle so nothing important falls off the end.
 * Mounted once per playthrough (in App), never per scene, so it asks exactly once at a time.
 * After a failure it waits for the next new moment before trying again.
 */
export function useChronicle(game, act) {
  const asking = useRef(false);
  const failedAt = useRef(null);
  const turns = game?.ai?.turns.length || 0;
  const mode = game?.mode;
  useEffect(() => {
    if (asking.current || !game?.ai || !needsChronicle(game)) return;
    const latest = game.ai.sequence;
    if (failedAt.current === latest) return;
    asking.current = true;
    const request = chronicleRequest(game);
    askClaude({ ...request, id: 'chronicle-' + latest, purpose: 'housekeeping' }).then((result) => {
      asking.current = false;
      if (result.ok && typeof result.data?.entry === 'string')
        act({ ...chronicleAction(result.data, request.absorbedTurnIds), mode });
      else failedAt.current = latest;
    });
  }, [turns, mode, game, act]);
}
