import { makeDecorator } from '@storybook/addons';

import styles from './View.module.css';

export const ViewDecorator = makeDecorator({
  name: 'ViewDecorator',
  parameterName: 'ViewDecorator',
  wrapper: function ViewDecorator(storyFn, context) {
    return <section className={styles.view}>{storyFn(context)}</section>;
  },
});
