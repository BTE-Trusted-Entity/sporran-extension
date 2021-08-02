import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export function useQuery(): { [key: string]: string } {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);
}
