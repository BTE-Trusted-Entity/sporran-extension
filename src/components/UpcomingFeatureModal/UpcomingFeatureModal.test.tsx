import { render, waitForDialogUpdate } from '../../testing/testing';

import { UpcomingFeatureModal } from './UpcomingFeatureModal';

describe('UpcomingFeatureModal', () => {
  it('should render', async () => {
    (
      HTMLDialogElement.prototype as unknown as {
        showModal: () => void;
      }
    ).showModal = jest.fn();

    const { container } = render(<UpcomingFeatureModal onClose={jest.fn()} />);
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
