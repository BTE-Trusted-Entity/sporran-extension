import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export function useQuery(): { [key: string]: string } {
  const { search } = useLocation();
  console.log('Search: ', search);

  return useMemo(() => {
    const params = new URLSearchParams(search);
    console.log('Params: ', params);
    const values = Object.values(params);
    console.log('values: ', values);
    const payload = values[0];
    return JSON.parse(window.atob(payload));
  }, [search]);
}
