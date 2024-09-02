import { isInternal } from '../../configuration/variant';

export function useSubscanHost(): string | undefined {
  return isInternal ? undefined : 'https://spiritnet.subscan.io';
}
