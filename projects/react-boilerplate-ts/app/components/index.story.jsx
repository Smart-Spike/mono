import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import ColorButtonStory from './TestComponent/ColorButton.story';

const withInfoInline = withInfo({ inline: true });

storiesOf('Components', module)
  .addDecorator(withKnobs)
  .add('ColorButton', withInfoInline(ColorButtonStory))
  .add('Button 2', withInfoInline(ColorButtonStory));
