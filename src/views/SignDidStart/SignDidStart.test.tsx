import { identitiesMock as identities, render } from '../../testing/testing';
import { parseDidUri, sameFullDid } from '../../utilities/did/did';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { SignDidStart } from './SignDidStart';

jest.mock('../../utilities/did/did');

jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
} as ReturnType<typeof parseDidUri>);

describe('SignDidStart', () => {
  it('should render full DID with credentials', () => {
    mockIsFullDid(true);
    jest.mocked(sameFullDid).mockReturnValue(true);

    const { container } = render(
      <SignDidStart
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        setPopupQuery={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render full DID with no credentials', () => {
    mockIsFullDid(true);
    jest.mocked(sameFullDid).mockReturnValue(false);

    const { container } = render(
      <SignDidStart
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        setPopupQuery={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render light DID', () => {
    mockIsFullDid(false);

    const { container } = render(
      <SignDidStart
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
        setPopupQuery={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
