import { configure } from '@storybook/react';

const req = require.context('../app', true, /story\.(js|ts)x?$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);