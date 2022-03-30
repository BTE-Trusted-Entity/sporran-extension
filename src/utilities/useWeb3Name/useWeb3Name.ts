import useSWR from 'swr';
import { Web3Names } from '@kiltprotocol/did';

export function useWeb3Name(did: string): string | null | undefined {
  return useSWR([did, 'Web3Names.queryWeb3NameForDid'], (did) =>
    Web3Names.queryWeb3NameForDid(did),
  ).data;
}
