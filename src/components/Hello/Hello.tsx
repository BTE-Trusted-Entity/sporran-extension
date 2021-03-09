import styles from './Hello.module.css';
import { browser } from 'webextension-polyfill-ts';

export function Hello(): JSX.Element {
  return (
    <div className="row">
      <div className="col-lg-12 text-center">
        <p className={styles.text}>
          Example Extension «{browser.i18n.getMessage('manifest_name')}»
        </p>
      </div>
    </div>
  );
}
