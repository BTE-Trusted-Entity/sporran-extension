import useSWR from 'swr';
import { castArray } from 'lodash-es';

export function useSwrDataOrThrow<Result>(
  key: Parameters<typeof useSWR>[0],
  fetcher: (...key: any) => Promise<Result>, // eslint-disable-line @typescript-eslint/no-explicit-any
  fetcherName: string,
): Result | undefined {
  const { data, error } = useSWR(
    [fetcherName, ...castArray(key)],
    (name, ...key) => fetcher(...key),
  );

  if (error) {
    throw error;
  }

  return data;
}
