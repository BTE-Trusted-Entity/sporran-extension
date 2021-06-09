import { contextGlobalName, variantInternal, variantPublic } from './variant';
import { ConfigurationProvider } from './ConfigurationContext';
import { InternalConfigurationContext } from './InternalConfigurationContext';

export const configurationTypesForStorybook = {
  [contextGlobalName]: {
    name: 'Variant',
    description: 'Public or internal extension variant',
    defaultValue: variantPublic,
    toolbar: {
      items: [
        { value: variantPublic, title: 'Public', icon: 'eye' },
        { value: variantInternal, title: 'Internal', icon: 'eyeclose' },
      ],
    },
  },
};

export function withConfigurationProvider(Story, context) {
  const isInternal = context.globals[contextGlobalName] === variantInternal;
  const Provider = isInternal
    ? InternalConfigurationContext
    : ConfigurationProvider;
  return (
    <Provider>
      <Story {...context} />
    </Provider>
  );
}
