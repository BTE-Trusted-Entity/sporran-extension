import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

const query =
  'Full+Name=Ingo+R%C3%BCbe&Email=ingo%40kilt.io&Credential+type=BL-Mail-Simple&Attester=SocialKYC&credential=eyJlbWFpbCI6ImluZ29Aa2lsdC5pbyJ9';

describe('SaveCredential', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.save}?${query}`]}>
        <SaveCredential />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
