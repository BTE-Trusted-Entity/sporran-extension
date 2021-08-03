import { MemoryRouter } from 'react-router-dom';

import { mockClaim } from '../../utilities/cTypes/cTypes.mock';
import { render } from '../../testing/testing';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

const encodedData = window.btoa(JSON.stringify(mockClaim));

describe('SignQuote', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[`${paths.popup.claim}?data=${encodedData}`]}
      >
        <SignQuote />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
