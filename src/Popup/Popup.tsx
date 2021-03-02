import { useEffect, FC } from 'react';

import { browser } from 'webextension-polyfill-ts';

import { Hello } from '../components/Hello/Hello';
import { Scroller } from '../components/Scroller/Scroller';

import styles from './Popup.module.css';

export const Popup: FC = () => {
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
      </div>
    </div>
  );
};
