import userEvent from '@testing-library/user-event';
import { act, render, screen } from '../../testing/testing';

import {
  getAuthorized,
  getDAppHostName,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';

import { ExternalAccess } from './ExternalAccess';

jest.mock('../../utilities/authorizedStorage/authorizedStorage');

const getAuthorizedPromise = Promise.resolve({
  'evil\nhttps://example.com/evil': false,
  'good\nhttps://example.org/good': true,
});
(getAuthorized as jest.Mock).mockReturnValue(getAuthorizedPromise);
(getDAppHostName as jest.Mock).mockReturnValue('example.org');

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

    userEvent.click(await screen.findByLabelText('example.orgdeniedallowed'));
    await act(async () => {
      await getAuthorizedPromise;
    });

    expect(setAuthorized).toHaveBeenCalledWith({
      'evil\nhttps://example.com/evil': true,
      'good\nhttps://example.org/good': true,
    });
  });
});
