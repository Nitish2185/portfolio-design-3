/**
 * Tiny store that tells the page when the intro loader has finished,
 * so entrance animations start at the right moment.
 */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

/** Runs `callback` once the intro is finished (right away if it already is). Returns an unsubscribe function. */
export function onIntroDone(callback: () => void) {
  if (done) {
    callback();
    return () => {};
  }
  const listener = () => {
    listeners.delete(listener);
    callback();
  };
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
