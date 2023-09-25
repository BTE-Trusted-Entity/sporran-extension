import { userEvent } from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';

import { CreatePassword } from './CreatePassword';

const onSuccess = jest.fn();

const props = {
  onSuccess,
};

describe('CreatePassword', () => {
  it('should render', async () => {
    const { container } = render(<CreatePassword {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should allow the strong password', async () => {
    render(<CreatePassword {...props} />);

    await userEvent.click(screen.getByText('Next Step'));
    expect(onSuccess).not.toHaveBeenCalled();

    await userEvent.type(
      screen.getByLabelText('Please enter your password'),
      'Hello, World!11',
    );
    await userEvent.click(screen.getByText('Next Step'));

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should allow visible and hidden passwords', async () => {
    const { container } = render(<CreatePassword {...props} />);
    expect(container).toMatchSnapshot();

    await userEvent.click(screen.getByLabelText('Show'));
    expect(container).toMatchSnapshot();

    await userEvent.click(screen.getByLabelText('Hide'));
    expect(container).toMatchSnapshot();
  });

  it('should report weak password errors', async () => {
    const { container } = render(<CreatePassword {...props} />);
    const password = screen.getByLabelText('Please enter your password');

    await userEvent.type(password, 'H');
    expect(container).toMatchSnapshot();

    await userEvent.type(password, 'ello');
    expect(container).toMatchSnapshot();

    await userEvent.type(password, '1');
    expect(container).toMatchSnapshot();

    await userEvent.type(password, '!!!!!');
    expect(container).toMatchSnapshot();

    // here the test should not report any more errors
    await userEvent.type(password, 'f');
    expect(container).toMatchSnapshot();
  });
});
