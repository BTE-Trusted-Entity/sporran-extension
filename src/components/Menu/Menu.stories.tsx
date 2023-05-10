import { Meta } from '@storybook/react';
import { JSX } from 'react';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import * as menuStyles from './Menu.module.css';

export default {
  title: 'Components/Menu',
} as Meta;

export function Template(): JSX.Element {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3);

  return (
    <div className={menuStyles.wrapper} style={{ float: 'right' }}>
      <button type="button" className={menuStyles.toggle} {...buttonProps}>
        ⚙
      </button>

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu">
          <h4 className={menuStyles.heading}>Heading</h4>

          <ul className={menuStyles.list}>
            <li className={menuStyles.listItem}>
              <a {...itemProps[0]}>Menu item 1</a>
            </li>
            <li className={menuStyles.listItem}>
              <a {...itemProps[1]}>Menu item 2</a>
            </li>
            <li className={menuStyles.listItem}>
              <a {...itemProps[2]}>Menu item 3</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
