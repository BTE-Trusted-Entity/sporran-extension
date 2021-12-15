const contextGlobalName = 'locale';

export const localeGlobalTypes = {
  [contextGlobalName]: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', left: '🇬🇧️', title: 'English' },
        { value: 'de', left: '🇩🇪️', title: 'Deutsch' },
        { value: 'fr', left: '🇫🇷️', title: 'Français' },
      ],
    },
  },
};

export function withLocale(Story, context) {
  document.documentElement.lang = context.globals[contextGlobalName];
  return <Story {...context} />;
}
