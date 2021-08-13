// https://gist.github.com/babakness/faca3b633bc23d9a0924efb069c9f1f5
// Typescript version of Dan Abramov's useInterval

import { useEffect, useRef } from 'react';

type IntervalFunction = () => unknown | void;

export function useInterval(callback: IntervalFunction, delay: number): void {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
