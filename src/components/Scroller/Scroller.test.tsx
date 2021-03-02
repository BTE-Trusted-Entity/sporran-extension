import { Scroller } from './Scroller';
import { create } from 'react-test-renderer';

it('Scroller renders', () => {
  const tree = create(<Scroller />).toJSON();
  expect(tree).toMatchSnapshot();
});
