import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { UpcomingFeatureModal } from './UpcomingFeatureModal';

export default {
  title: 'Components/UpcomingFeatureModal',
  component: UpcomingFeatureModal,
} as Meta;

export function Template(): JSX.Element {
  return <UpcomingFeatureModal onClose={action('closeOverlay')} />;
}
