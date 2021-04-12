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

export async function setNextTartan(): Promise<void> {
  const accounts = await getAccounts();
  const usedTartans: string[] = [];
  Object.values(accounts).forEach((account) =>
    usedTartans.push(account.tartan),
  );

  const availablePopularTartans = popularTartans.filter(
    (tartan) => !usedTartans.includes(tartan),
  );
  const randomPopularTartan =
    availablePopularTartans[
      Math.floor(Math.random() * availablePopularTartans.length)
    ];
  if (availablePopularTartans) {
    await storage.set({
      [NEXT_TARTAN]: randomPopularTartan,
    });
    return;
  }

  const availableOtherTartans = otherTartans.filter(
    (tartan) => !usedTartans.includes(tartan),
  );
  const randomOtherTartan =
    availableOtherTartans[
      Math.floor(Math.random() * availableOtherTartans.length)
    ];
  if (availableOtherTartans) {
    await storage.set({
      [NEXT_TARTAN]: randomOtherTartan,
    });
    return;
  }

  // if all tartans are used, start reusing them
  const allTartans = [...popularTartans, ...otherTartans];
  await storage.set({
    [NEXT_TARTAN]: allTartans[Math.floor(Math.random() * allTartans.length)],
  });
}
