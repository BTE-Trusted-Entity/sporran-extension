import { userEvent } from '@testing-library/user-event';

import { act, render, screen } from '../../testing/testing';

import {
  getAuthorized,
  setAuthorized,
} from '../../utilities/authorizedStorage/authorizedStorage';

import { ExternalAccess } from './ExternalAccess';

jest.mock('../../utilities/authorizedStorage/authorizedStorage');

const getAuthorizedPromise = Promise.resolve({
  'example.com': false,
  'example.org': true,
});
jest.mocked(getAuthorized).mockReturnValue(getAuthorizedPromise);

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

    await userEvent.click(
      await screen.findByLabelText('example.comdeniedallowed'),
    );
    await act(async () => {
      await getAuthorizedPromise;
    });

    expect(setAuthorized).toHaveBeenCalledWith({
      'example.com': true,
      'example.org': true,
    });
  });
});
