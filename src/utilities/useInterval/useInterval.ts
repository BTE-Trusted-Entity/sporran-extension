import { useEffect } from 'react';

type IntervalFunction = () => unknown | void;

export function useInterval(callback: IntervalFunction, delay: number): void {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}
