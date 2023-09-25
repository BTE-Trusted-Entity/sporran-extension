import { useRef } from 'react';
import { userEvent } from '@testing-library/user-event';

import {
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { ExplainerModal } from './ExplainerModal';

function Component() {
  const portalRef = useRef<HTMLDivElement>(null);
  return (
    <section>
      <ExplainerModal label="Click me!" portalRef={portalRef}>
        Wikipedia is an online free-content encyclopedia helping to create a
        world where everyone can freely share and access all available
        knowledge. It is supported by the Wikimedia Foundation and consists of
        freely editable content.
      </ExplainerModal>

      <div ref={portalRef} />
    </section>
  );
}

describe('ExplainerModal', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when shown', async () => {
    mockDialogShowModal();
    const { container, findByLabelText } = render(<Component />);
    await userEvent.click(await findByLabelText('Click me!'));
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
