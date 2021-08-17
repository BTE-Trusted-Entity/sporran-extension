import userEvent from '@testing-library/user-event';
import { act, render, screen } from '../../testing/testing';

import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';

import { ExternalAccess } from './ExternalAccess';

jest.mock('../../utilities/authorizedStorage/authorizedStorage');

const getAuthorizedPromise = Promise.resolve({
  'https://example.com/evil': false,
  'https://example.org/good': true,
});
(getAuthorized as jest.Mock).mockReturnValue(getAuthorizedPromise);

describe('ExternalAccess', () => {
  it('should render', async () => {
    const { container } = render(<ExternalAccess />);
    await act(async () => {
      await getAuthorizedPromise;
    });

    expect(container).toMatchSnapshot();
  });

  it('should toggle the access', async () => {
    render(<ExternalAccess />);
    await act(async () => {
      await getAuthorizedPromise;
    });

    userEvent.click(
      await screen.findByLabelText('https://example.com/evildeniedallowed'),
    );
    await act(async () => {
      await getAuthorizedPromise;
    });

    expect(setAuthorized).toHaveBeenCalledWith({
      'https://example.com/evil': true,
      'https://example.org/good': true,
    });
  });
});
