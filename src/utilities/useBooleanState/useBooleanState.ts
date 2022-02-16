import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface UseBooleanState {
  current: boolean;
  on: () => void;
  off: () => void;
  toggle: () => void;
  set: Dispatch<SetStateAction<boolean>>;
}

export function useBooleanState(initialState = false): UseBooleanState {
  const [current, set] = useState(initialState);

  const on = useCallback(() => set(true), []);
  const off = useCallback(() => set(false), []);
  const toggle = useCallback(() => set(!current), [current]);

  return useMemo(
    () => ({
      current,
      on,
      off,
      toggle,
      set,
    }),
    [current, on, off, toggle],
  );
}
