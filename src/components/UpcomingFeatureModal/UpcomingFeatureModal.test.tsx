import {
  render,
  waitForDialogUpdate,
  mockDialogShowModal,
} from '../../testing/testing';

import { UpcomingFeatureModal } from './UpcomingFeatureModal';

describe('UpcomingFeatureModal', () => {
  it('should render', async () => {
    mockDialogShowModal();

    const { container } = render(<UpcomingFeatureModal onClose={jest.fn()} />);
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
