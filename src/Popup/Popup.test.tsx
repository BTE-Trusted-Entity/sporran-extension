import { Popup } from './Popup';
import { create } from 'react-test-renderer';

it('Popup renders', () => {
  const tree = create(<Popup />).toJSON();
  expect(tree).toMatchSnapshot();
});
