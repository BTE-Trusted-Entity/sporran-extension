import { Hello } from './Hello';
import { create } from 'react-test-renderer';

it('Hello renders', () => {
  const tree = create(<Hello />).toJSON();
  expect(tree).toMatchSnapshot();
});
