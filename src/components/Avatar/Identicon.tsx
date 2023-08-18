import { polkadotIcon } from '@polkadot/ui-shared';

interface Props {
  address: string;
  className?: string;
  size: number;
}

export function Identicon({ address, className = '', size }: Props) {
  const circles = polkadotIcon(address, { isAlternative: false });
  return (
    <svg className={className} height={size} width={size} viewBox="0 0 64 64">
      {circles.map(({ cx, cy, fill, r }, key) => (
        <circle cx={cx} cy={cy} fill={fill} r={r} key={key} />
      ))}
    </svg>
  );
}
