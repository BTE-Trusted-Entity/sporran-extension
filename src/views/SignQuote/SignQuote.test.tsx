import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

const query =
  'Full+Name=Ingo+R%C3%BCbe&Email=ingo%40kilt.io&Credential+type=BL-Mail-Simple&Attester=SocialKYC';

describe('SignQuote', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.claim}?${query}`]}>
        <SignQuote />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
