import { CSSProperties, MutableRefObject, useRef } from 'react';
import { usePopper } from 'react-popper';
import cx from 'classnames';

import moreStyles from './useErrorTooltip.module.css';

interface useErrorTooltipType {
  anchor: {
    ref: MutableRefObject<null>;
  };
  pointer: {
    ref: MutableRefObject<null>;
    style: CSSProperties;
    className: string;
    'data-popper-arrow': boolean;
  };
  tooltip: {
    ref: MutableRefObject<null>;
    style: CSSProperties;
    className: string;
  };
}

export function useErrorTooltip(visible: boolean): useErrorTooltipType {
  const anchorRef = useRef(null);
  const pointerRef = useRef(null);
  const popperRef = useRef(null);

  const modifier = { name: 'arrow', options: { element: pointerRef.current } };
  const { styles, attributes } = usePopper(
    anchorRef.current,
    popperRef.current,
    { modifiers: [modifier] },
  );

  return {
    anchor: { ref: anchorRef },
    pointer: {
      ref: pointerRef,
      style: styles.arrow,
      className: moreStyles.pointer,
      'data-popper-arrow': true,
    },
    tooltip: {
      ref: popperRef,
      style: styles.popper,
      className: cx(moreStyles.tooltip, visible && moreStyles.visible),
      ...attributes.popper,
    },
  };
}
