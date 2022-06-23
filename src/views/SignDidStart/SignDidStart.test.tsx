import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { identitiesMock as identities, render } from '../../testing/testing';
import { parseDidUri, sameFullDid } from '../../utilities/did/did';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SignDidStart } from './SignDidStart';

jest.mock('../../utilities/did/did');

jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
} as ReturnType<typeof parseDidUri>);

const input: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext:
    'AllyourbasearebelongtousAllyourbasearebelongtousAllyourbasearebelongtous',
};

describe('SignDidStart', () => {
  it('should render full DID with credentials', () => {
    mockIsFullDid(true);
    jest.mocked(sameFullDid).mockReturnValue(true);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid.start} data={input}>
        <SignDidStart
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
          onPopupData={jest.fn()}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render full DID with no credentials', () => {
    mockIsFullDid(true);
    jest.mocked(sameFullDid).mockReturnValue(false);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid.start} data={input}>
        <SignDidStart
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
          onPopupData={jest.fn()}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render light DID', () => {
    mockIsFullDid(false);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid.start} data={input}>
        <SignDidStart
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
          onPopupData={jest.fn()}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
