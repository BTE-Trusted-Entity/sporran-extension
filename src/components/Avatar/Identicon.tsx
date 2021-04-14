// Copyright 2018-2021 @polkadot/ui-shared authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2018 Paritytech via paritytech/oo7/polkadot-identicon

// This has been converted from the original version that can be found at
//
// https://github.com/polkadot-js/ui/blob/master/packages/ui-shared/src/icons/polkadot.ts

import { useEffect, useState } from 'react';

export interface Circle {
  cx: number;
  cy: number;
  fill: string;
  r: number;
}

interface Scheme {
  freq: number;
  colors: number[];
}

async function hash(input: string): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(input),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16),
      iterations: 1,
      hash: 'SHA-256',
    },
    keyMaterial,
    8 * 64,
  );
  return new Uint8Array(bits);
}

const S = 64;
const C = S / 2;
const Z = (S / 64) * 5;

const SCHEMA: { [index: string]: Scheme } = {
  target: {
    colors: [0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 1],
    freq: 1,
  },
  cube: {
    colors: [0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 5],
    freq: 20,
  },
  quazar: {
    colors: [1, 2, 3, 1, 2, 4, 5, 5, 4, 1, 2, 3, 1, 2, 4, 5, 5, 4, 0],
    freq: 16,
  },
  flower: {
    colors: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3],
    freq: 32,
  },
  cyclic: {
    colors: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6],
    freq: 32,
  },
  vmirror: {
    colors: [0, 1, 2, 3, 4, 5, 3, 4, 2, 0, 1, 6, 7, 8, 9, 7, 8, 6, 10],
    freq: 128,
  },
  hmirror: {
    colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 6, 7, 5, 3, 4, 2, 11],
    freq: 128,
  },
};
/* eslint-enable sort-keys */

const OUTER_CIRCLE: Circle = {
  cx: C,
  cy: C,
  fill: '#eee',
  r: C,
};

function getRotation(): {
  r: number;
  ro2: number;
  r3o4: number;
  ro4: number;
  rroot3o2: number;
  rroot3o4: number;
} {
  const r = (C / 4) * 3;
  const rroot3o2 = (r * Math.sqrt(3)) / 2;
  const ro2 = r / 2;
  const rroot3o4 = (r * Math.sqrt(3)) / 4;
  const ro4 = r / 4;
  const r3o4 = (r * 3) / 4;

  return { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 };
}

function getCircleXY(): [number, number][] {
  const { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 } = getRotation();

  return [
    [C, C - r],
    [C, C - ro2],
    [C - rroot3o4, C - r3o4],
    [C - rroot3o2, C - ro2],
    [C - rroot3o4, C - ro4],
    [C - rroot3o2, C],
    [C - rroot3o2, C + ro2],
    [C - rroot3o4, C + ro4],
    [C - rroot3o4, C + r3o4],
    [C, C + r],
    [C, C + ro2],
    [C + rroot3o4, C + r3o4],
    [C + rroot3o2, C + ro2],
    [C + rroot3o4, C + ro4],
    [C + rroot3o2, C],
    [C + rroot3o2, C - ro2],
    [C + rroot3o4, C - ro4],
    [C + rroot3o4, C - r3o4],
    [C, C],
  ];
}

function findScheme(d: number): Scheme {
  let cum = 0;
  const schema = Object.values(SCHEMA).find((schema): boolean => {
    cum += schema.freq;

    return d < cum;
  });

  if (!schema) {
    throw new Error('Unable to find schema');
  }

  return schema;
}

async function getColors(address: string): Promise<string[]> {
  const total = Object.values(SCHEMA)
    .map((s): number => s.freq)
    .reduce((a, b): number => a + b);
  const id = await hash(address);
  const d = Math.floor((id[30] + id[31] * 256) % total);
  const rot = (id[28] % 6) * 3;
  const sat = (Math.floor((id[29] * 70) / 256 + 26) % 80) + 30;
  const scheme = findScheme(d);
  const palette = Array.from(id).map((x, i): string => {
    const b = (x + (i % 28) * 58) % 256;

    if (b === 0) {
      return '#444';
    } else if (b === 255) {
      return 'transparent';
    }

    const h = Math.floor(((b % 64) * 360) / 64);
    const l = [53, 15, 35, 75][Math.floor(b / 64)];

    return `hsl(${h}, ${sat}%, ${l}%)`;
  });

  return scheme.colors.map(
    (_, i): string => palette[scheme.colors[i < 18 ? (i + rot) % 18 : 18]],
  );
}

/**
 * @description Generate a array of the circles that make up an identicon
 */
async function polkadotIcon(address: string): Promise<Circle[]> {
  const colors = await getColors(address);

  return [OUTER_CIRCLE].concat(
    getCircleXY().map(([cx, cy], index) => ({
      cx,
      cy,
      fill: colors[index],
      r: Z,
    })),
  );
}

interface Props {
  address: string;
  className?: string;
  size: number;
}

export function Identicon({
  address,
  className = '',
  size,
}: Props): JSX.Element | null {
  const [circles, setCircles] = useState<Circle[] | null>(null);
  useEffect(() => {
    (async () => {
      setCircles(await polkadotIcon(address));
    })();
  }, [address]);

  if (!circles) {
    return null;
  }

  return (
    <svg className={className} height={size} width={size} viewBox="0 0 64 64">
      {circles.map(({ cx, cy, fill, r }, key) => (
        <circle cx={cx} cy={cy} fill={fill} r={r} key={key} />
      ))}
    </svg>
  );
}
