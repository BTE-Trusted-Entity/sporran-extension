import { useLocation } from 'react-router-dom';

export function useQuery(): { [key: string]: string } {
  const params = new URLSearchParams(useLocation().search);
  return Object.fromEntries(params.entries());
}
