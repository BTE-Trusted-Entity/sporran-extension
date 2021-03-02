import path from 'path';
import chromeLaunch from 'chrome-launch';

chromeLaunch('about:blank', {
  args: [`--load-extension=${path.resolve('./dist')}`],
});
