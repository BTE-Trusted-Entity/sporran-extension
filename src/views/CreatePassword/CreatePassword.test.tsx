import userEvent from '@testing-library/user-event';

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

    userEvent.click(screen.getByText('Next Step'));
    expect(onSuccess).not.toHaveBeenCalled();

    userEvent.type(
      screen.getByLabelText('Please enter your password'),
      'Hello, World!11',
    );
    userEvent.click(screen.getByText('Next Step'));

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should allow visible and hidden passwords', async () => {
    const { container } = render(<CreatePassword {...props} />);
    expect(container).toMatchSnapshot();

    userEvent.click(screen.getByLabelText('Show'));
    expect(container).toMatchSnapshot();

    userEvent.click(screen.getByLabelText('Hide'));
    expect(container).toMatchSnapshot();
  });

  it('should report weak password errors', async () => {
    const { container } = render(<CreatePassword {...props} />);
    const password = screen.getByLabelText('Please enter your password');

    userEvent.type(password, 'H');
    expect(container).toMatchSnapshot();

    userEvent.type(password, 'ello');
    expect(container).toMatchSnapshot();

    userEvent.type(password, '1');
    expect(container).toMatchSnapshot();

    userEvent.type(password, '!!!!!');
    expect(container).toMatchSnapshot();

    // here the test should not report any more errors
    userEvent.type(password, 'f');
    expect(container).toMatchSnapshot();
  });
});
