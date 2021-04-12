import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';

import { usePasswordType } from './usePasswordType';

function TestComponent() {
  const { passwordType, passwordToggle } = usePasswordType();
  return (
    <form>
      <input type={passwordType} />
      {passwordToggle}
    </form>
  );
}

describe('usePasswordType', () => {
  it('should provide values for rendering and toggle them', async () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchSnapshot();

    userEvent.click(await screen.findByRole('button'));
    expect(container).toMatchSnapshot();

    userEvent.click(await screen.findByRole('button'));
    expect(container).toMatchSnapshot();
  });
});
