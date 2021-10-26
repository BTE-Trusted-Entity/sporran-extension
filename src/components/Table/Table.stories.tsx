import { Meta } from '@storybook/react';

import * as tableStyles from './Table.module.css';

export default {
  title: 'Components/Table',
} as Meta;

export function Template(): JSX.Element {
  return (
    <table className={tableStyles.table}>
      <thead>
        <tr className={tableStyles.tr}>
          <th className={tableStyles.th}>Name</th>
          <th className={tableStyles.th}>Type</th>
          <th className={tableStyles.th}>Attester</th>
        </tr>
      </thead>
      <tbody>
        <tr className={tableStyles.tr}>
          <td className={tableStyles.td}>Email</td>
          <td className={tableStyles.td}>BL-Mail-Simple</td>
          <td className={tableStyles.td}>SocialKYC</td>
        </tr>
        <tr className={tableStyles.tr}>
          <td className={tableStyles.td}>Twitter</td>
          <td className={tableStyles.td}>TW-Identity</td>
          <td className={tableStyles.td}>Twitter</td>
        </tr>
        <tr className={tableStyles.tr}>
          <td className={tableStyles.td}>Phone number</td>
          <td className={tableStyles.td}>DE-Phone-Simple</td>
          <td className={tableStyles.td}>Deutsche Telekom</td>
        </tr>
      </tbody>
    </table>
  );
}
