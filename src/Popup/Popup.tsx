import { useEffect } from 'react';

import { browser } from 'webextension-polyfill-ts';

import { Hello } from '../components/Hello/Hello';
import { Scroller } from '../components/Scroller/Scroller';
import { CreateAccount } from '../screens/CreateAccount/CreateAccount';

import styles from './Popup.module.css';

export function Popup(): JSX.Element {
  // Sends the `popupMounted` event
  useEffect(() => {
    browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  // Renders the component tree
  return (
    <div className={styles.container}>
      <div className="container mx-4 my-4">
        <Hello />
        <hr />
        <Scroller />
        <CreateAccount />
      </div>
    </div>
  );
}
