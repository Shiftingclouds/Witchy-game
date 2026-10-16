export async function apiRequest(path, { method = 'GET', body, setupCode, signal } = {}) {
  const timeout = AbortSignal.timeout(30_000);
  let response;
  try {
    response = await fetch(path, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(setupCode ? { Authorization: `Bearer ${setupCode.trim()}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      cache: 'no-store',
    });
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') throw error;
    throw new Error(
      'The game server is unreachable. Start it or reconnect; prepared play still works.',
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The game server returned an unreadable response. Check that it is running.');
  }
  if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
  return data;
}
