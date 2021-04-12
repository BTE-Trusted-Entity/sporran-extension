import { map, sample, without } from 'lodash-es';
import { getAccounts } from './getAccounts';
import { storage } from './storage';

const popularTartans = [
  'MacLeod',
  'MacIntyre',
  'MacFarlane',
  'MacLachlan',
  'MacPherson',
  'MacGregor',
];

const otherTartans = [
  'Armstrong',
  'Barclay',
  'Brodie',
  'Bruce',
  'Buchanan',
  'Cameron',
  'Campbell',
  'Chisholm',
  'Clanranald',
  'Comyn',
  'Cunningham',
  'Douglas',
  'Dundas',
  'Erskine',
  'Farquharson',
  'Forbes',
  'Fraser',
  'Gordon',
  'Graham',
  'Grant',
  'Gunn',
  'Hamilton',
  'Hay',
  'Lamont',
  'MacArthur',
  'MacDonald',
  'MacDuff',
  'MacKay',
  'MacKenzie',
  'MacKinnon',
  'MacKintosh',
  'MacLean',
  'MacNab',
  'MacNeil',
  'MacQueen',
  'Menzies',
  'Munro',
  'Murray',
  'Ranald',
  'Robertson',
  'Scott',
  'Sinclair',
  'Stewart',
  'Stuart',
  'Sutherland',
  'Wallace',
];

export const NEXT_TARTAN = 'nextTartan';

async function setNextTartan(tartan: string): Promise<void> {
  await storage.set({
    [NEXT_TARTAN]: tartan,
  });
}

export async function updateNextTartan(): Promise<void> {
  const accounts = await getAccounts();
  const usedTartans = map(accounts, 'tartan');

  const availablePopularTartans = without(popularTartans, ...usedTartans);

  if (availablePopularTartans) {
    const randomPopularTartan = sample(availablePopularTartans);
    setNextTartan(randomPopularTartan);
    return;
  }

  const availableOtherTartans = without(otherTartans, ...usedTartans);

  if (availableOtherTartans) {
    const randomOtherTartan = sample(availableOtherTartans);
    setNextTartan(randomOtherTartan);
    return;
  }

  // if all tartans are used, start reusing them
  const allTartans = [...popularTartans, ...otherTartans];
  await setNextTartan(sample(allTartans));
}

export async function getNextTartan(): Promise<string> {
  const tartan = (await storage.get(NEXT_TARTAN))[NEXT_TARTAN] as string;
  if (!tartan) {
    await updateNextTartan();
    return (await storage.get(NEXT_TARTAN))[NEXT_TARTAN] as string;
  }
  return tartan;
}
