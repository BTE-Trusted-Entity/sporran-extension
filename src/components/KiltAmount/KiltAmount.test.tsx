import BN from 'bn.js';

import { render } from '../../testing/testing';
import { asKiltCoins, KiltAmount } from './KiltAmount';

describe('KiltAmount', () => {
  describe('asKiltCoins', () => {
    it('should stringify the BN', async () => {
      expect(asKiltCoins(new BN(1.234e15), 'funds')).toEqual('1.2340');
    });

    describe('funds', () => {
      it('should keep value when no rounding is needed', async () => {
        expect(asKiltCoins(new BN(1.2345e15), 'funds')).toEqual('1.2345');
      });

      it('should round down the slightly larger value', async () => {
        expect(asKiltCoins(new BN(1.23450001e15), 'funds')).toEqual('1.2345');
      });

      it('should round down the almost next value', async () => {
        expect(asKiltCoins(new BN(1.23459999e15), 'funds')).toEqual('1.2345');
        expect(asKiltCoins(new BN(1.99999999e15), 'funds')).toEqual('1.9999');
      });
    });

    describe('costs', () => {
      it('should keep value when no rounding is needed', async () => {
        expect(asKiltCoins(new BN(1.2345e15), 'costs')).toEqual('1.2345');
      });

      it('should round up even the slightly larger values', async () => {
        expect(asKiltCoins(new BN(1.00000001e15), 'costs')).toEqual('1.0001');
        expect(asKiltCoins(new BN(1.23450001e15), 'costs')).toEqual('1.2346');
      });

      it('should round up the almost next value', async () => {
        expect(asKiltCoins(new BN(1.23450001e15), 'costs')).toEqual('1.2346');
      });
    });
  });

  describe('KiltAmount', () => {
    it('should render funds', async () => {
      const { container } = render(
        <KiltAmount amount={new BN(1.23459999e15)} type="funds" />,
      );
      expect(container).toMatchSnapshot();
    });
    it('should render costs', async () => {
      const { container } = render(
        <KiltAmount amount={new BN(1.23450001e15)} type="costs" />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
