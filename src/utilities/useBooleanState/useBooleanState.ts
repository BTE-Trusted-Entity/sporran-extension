import { useRef, useState } from 'react';

interface UseBooleanState {
  current: boolean;
  on: () => void;
  off: () => void;
  toggle: () => void;
  set: (value: boolean) => void;
}

export function useBooleanState(initialState = false): UseBooleanState {
  const [, setCurrent] = useState(initialState);

  function set(value: boolean) {
    ref.current.current = value;

    // update the state to notify React about changes
    setCurrent(value);
  }

  const ref = useRef({
    current: initialState,
    on: () => set(true),
    off: () => set(false),
    toggle: () => set(!ref.current.current),
    set: (value: boolean) => set(Boolean(value)),
  });

  return ref.current;
}
