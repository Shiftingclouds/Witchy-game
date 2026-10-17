import { useCallback, useEffect, useRef, useState } from 'react';
import { askClaude, cancelClaude } from '../../ai/claude.mjs';
import { buildTurnContext } from '../../ai/context.mjs';
import { replySchema, validateReply } from '../../ai/contract.mjs';
import { needsChronicle, chronicleRequest, chronicleAction } from '../../ai/memory.mjs';

/**
 * One exchange with the storyteller: build context → ask Claude → validate (retrying once with the
 * problems listed) → dispatch ai-turn. Failures leave the save unchanged and keep the player's words.
 */
export function useTurn({ game, act, mode }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const last = useRef(null);
  const housekeeping = useRef(false);

  const send = useCallback(
    async (text, { focus = {}, decision = null, onReply } = {}) => {
      const words = String(text || '').trim();
      if (!words || busy) return null;
      last.current = { text: words, options: { focus, decision, onReply } };
      setBusy(true);
      setError(null);
      const context = buildTurnContext({ game, mode, input: words, focus: { ...focus, decision } });
      const schema = replySchema(mode, decision ? { decision } : undefined);
      let prompt = context.prompt;
      let validated = null;
      for (let attempt = 0; attempt < 2 && !validated?.reply; attempt++) {
        const result = await askClaude({
          system: context.system,
          prompt,
          schema,
          purpose: decision ? 'housekeeping' : 'story',
        });
        if (!result.ok) {
          setBusy(false);
          setError(result.error);
          return null;
        }
        validated = validateReply(result.data, { game, mode, decision });
        if (!validated.reply || (decision && !validated.reply.mappedOption))
          prompt = `${context.prompt}\n\n# YOUR LAST REPLY COULD NOT BE USED\n${validated.errors.join('\n')}\nPlease answer again, following the rules.`;
      }
      setBusy(false);
      if (!validated?.reply || (decision && !validated.reply.mappedOption)) {
        setError('invalid');
        return null;
      }
      last.current = null;
      onReply?.(validated.reply);
      act({
        type: 'ai-turn',
        requestId: crypto.randomUUID(),
        player: words,
        reply: validated.reply,
        section: focus.sectionId,
      });
      return validated.reply;
    },
    [busy, game, mode, act],
  );

  // Quietly fold older moments into the chronicle so nothing important falls off the end.
  useEffect(() => {
    if (busy || housekeeping.current || !game?.ai || !needsChronicle(game)) return;
    housekeeping.current = true;
    const request = chronicleRequest(game);
    askClaude({ ...request, purpose: 'housekeeping' }).then((result) => {
      housekeeping.current = false;
      if (result.ok && typeof result.data?.entry === 'string')
        act(chronicleAction(result.data, request.absorbedTurnIds));
    });
  }, [busy, game, act]);

  const retry = useCallback(() => {
    if (last.current) return send(last.current.text, last.current.options);
  }, [send]);
  const cancel = useCallback(() => {
    cancelClaude();
  }, []);
  return { busy, error, send, retry, cancel, pendingText: last.current?.text ?? null };
}
