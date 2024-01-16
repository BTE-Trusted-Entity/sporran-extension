import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { render } from '../../testing/testing';

import { asKiltCoins, KiltAmount } from './KiltAmount';

describe('KiltAmount', () => {
  describe('asKiltCoins', () => {
    it('should stringify the BN', async () => {
      expect(asKiltCoins(BalanceUtils.toFemtoKilt(1.234), 'funds')).toEqual(
        '1.2340',
      );
    });

    describe('funds', () => {
      it('should keep value when no rounding is needed', async () => {
        expect(asKiltCoins(BalanceUtils.toFemtoKilt(1.2345), 'funds')).toEqual(
          '1.2345',
        );
      });

      it('should round down the slightly larger value', async () => {
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.23450001), 'funds'),
        ).toEqual('1.2345');
      });

      it('should round down the almost next value', async () => {
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.23459999), 'funds'),
        ).toEqual('1.2345');
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.99999999), 'funds'),
        ).toEqual('1.9999');
      });
    });

    describe('costs', () => {
      it('should keep value when no rounding is needed', async () => {
        expect(asKiltCoins(BalanceUtils.toFemtoKilt(1.2345), 'costs')).toEqual(
          '1.2345',
        );
      });

      it('should round up even the slightly larger values', async () => {
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.00000001), 'costs'),
        ).toEqual('1.0001');
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.23450001), 'costs'),
        ).toEqual('1.2346');
      });

      it('should round up the almost next value', async () => {
        expect(
          asKiltCoins(BalanceUtils.toFemtoKilt(1.23450001), 'costs'),
        ).toEqual('1.2346');
      });
    });
  });

  describe('KiltAmount', () => {
    it('should render funds', async () => {
      const { container } = render(
        <KiltAmount
          amount={BalanceUtils.toFemtoKilt(1.23459999)}
          type="funds"
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('should render costs', async () => {
      const { container } = render(
        <KiltAmount
          amount={BalanceUtils.toFemtoKilt(1.23450001)}
          type="costs"
        />,
      );
      expect(container).toMatchSnapshot();
    });
    it('should render with small fractional part', async () => {
      const { container } = render(
        <KiltAmount
          amount={BalanceUtils.toFemtoKilt(1.23450001)}
          type="costs"
          smallDecimals
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
