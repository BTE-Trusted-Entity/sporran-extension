import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../../views/paths';

import { Identicon } from './Identicon';

import styles from './Avatar.module.css';

interface Props {
  tartan: string;
  address?: string;
  className?: string;
}

const classNameForTartan: { [key: string]: string } = {
  Armstrong: styles.Armstrong,
  Barclay: styles.Barclay,
  Brodie: styles.Brodie,
  Bruce: styles.Bruce,
  Buchanan: styles.Buchanan,
  Cameron: styles.Cameron,
  Campbell: styles.Campbell,
  Chisholm: styles.Chisholm,
  Clanranald: styles.Clanranald,
  Comyn: styles.Comyn,
  Cunningham: styles.Cunningham,
  Douglas: styles.Douglas,
  Dundas: styles.Dundas,
  Erskine: styles.Erskine,
  Farquharson: styles.Farquharson,
  Forbes: styles.Forbes,
  Fraser: styles.Fraser,
  Gordon: styles.Gordon,
  Graham: styles.Graham,
  Grant: styles.Grant,
  Gunn: styles.Gunn,
  Hamilton: styles.Hamilton,
  Hay: styles.Hay,
  Lamont: styles.Lamont,
  MacArthur: styles.MacArthur,
  MacDonald: styles.MacDonald,
  MacDuff: styles.MacDuff,
  MacFarlane: styles.MacFarlane,
  MacGregor: styles.MacGregor,
  MacIntyre: styles.MacIntyre,
  MacKay: styles.MacKay,
  MacKenzie: styles.MacKenzie,
  MacKinnon: styles.MacKinnon,
  MacKintosh: styles.MacKintosh,
  MacLachlan: styles.MacLachlan,
  MacLean: styles.MacLean,
  MacLeod: styles.MacLeod,
  MacNab: styles.MacNab,
  MacNeil: styles.MacNeil,
  MacPherson: styles.MacPherson,
  MacQueen: styles.MacQueen,
  Menzies: styles.Menzies,
  Munro: styles.Munro,
  Murray: styles.Murray,
  Ranald: styles.Ranald,
  Robertson: styles.Robertson,
  Scott: styles.Scott,
  Sinclair: styles.Sinclair,
  Stewart: styles.Stewart,
  Stuart: styles.Stuart,
  Sutherland: styles.Sutherland,
  Wallace: styles.Wallace,
};

export function Avatar({
  tartan,
  address,
  className = styles.tartan,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <div className={`${classNameForTartan[tartan]} ${className}`}>
      {address ? (
        <Identicon className={styles.identicon} address={address} size={64} />
      ) : (
        <Link
          to={paths.account.create.start}
          className={styles.new}
          aria-label={t('component_Avatar_title_new')}
          title={t('component_Avatar_title_new')}
        />
      )}
    </div>
  );
}
