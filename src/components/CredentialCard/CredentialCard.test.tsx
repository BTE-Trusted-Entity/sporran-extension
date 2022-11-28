import userEvent from '@testing-library/user-event';

import { identitiesMock, render, screen } from '../../testing/testing';

import {
  credentialsMock,
  mockRequestCredential,
  notDownloaded,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../../views/paths';
import { waitForDownloadInfo } from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage.mock';
import { waitForPresentationInfo } from '../../utilities/showPresentationInfoStorage/showPresentationInfoStorage.mock';

import { CredentialCard } from './CredentialCard';
import { ShareCredentialCard } from './ShareCredentialCard';
import { SignDidCredentialCard } from './SignDidCredentialCard';

describe('CredentialCard', () => {
  it('should render collapsed card', async () => {
    const { container } = render(
      <CredentialCard sporranCredential={credentialsMock[0]} />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render expanded card on click', async () => {
    const { container } = render(
      <CredentialCard sporranCredential={credentialsMock[0]} />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Email Credential mockEmail@mock.mock',
      }),
    );
    expect(container).toMatchSnapshot();
  });

  it('should render uncollapsible card', async () => {
    const { container } = render(
      <CredentialCard
        sporranCredential={credentialsMock[0]}
        expand
        collapsible={false}
      />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render expanded card without backup and delete buttons', async () => {
    const { container } = render(
      <CredentialCard
        sporranCredential={credentialsMock[0]}
        expand
        buttons={false}
      />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render collapsed card with backup notification', async () => {
    const { container } = render(
      <CredentialCard sporranCredential={notDownloaded[0]} />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render expanded card with backup notification', async () => {
    const { container } = render(
      <CredentialCard expand sporranCredential={notDownloaded[0]} />,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render collapased share credential card', () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialCard
          sporranCredential={credentialsMock[0]}
          identity={identitiesMock[0]}
          onSelect={jest.fn()}
          viewRef={{ current: null }}
          expand={false}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render expanded share credential card', () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialCard
          sporranCredential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected
          onSelect={jest.fn()}
          viewRef={{ current: null }}
          expand={false}
        />
      </PopupTestProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should expand last share credential card', () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialCard
          sporranCredential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected
          onSelect={jest.fn()}
          viewRef={{ current: null }}
          expand={true}
        />
      </PopupTestProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render collapsed signDid credential card', () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <SignDidCredentialCard
          sporranCredential={credentialsMock[0]}
          onSelect={jest.fn()}
          onUnSelect={jest.fn()}
          viewRef={{ current: null }}
        />
      </PopupTestProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render expanded signDid credential card', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <SignDidCredentialCard
          sporranCredential={credentialsMock[0]}
          onSelect={jest.fn()}
          onUnSelect={jest.fn()}
          viewRef={{ current: null }}
        />
      </PopupTestProvider>,
    );

    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Email Credential Trusted Entity attester',
      }),
    );

    expect(container).toMatchSnapshot();
  });
});
