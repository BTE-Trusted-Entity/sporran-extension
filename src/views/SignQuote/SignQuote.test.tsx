import { MemoryRouter } from 'react-router-dom';

import { mockClaim } from '../../utilities/cTypes/cTypes.mock';
import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { render } from '../../testing/testing';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

const encodedData = jsonToBase64(mockClaim);

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
