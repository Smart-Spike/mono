import * as React from 'react';
import ColorButton, { someEnum } from './ColorButton';
import { boolean, select, color } from '@storybook/addon-knobs';
import { selectEnum } from '../../utils/storybook';

const props = () => ({
  someType: select('someType', selectEnum(someEnum), someEnum.Bob),
  enabled: boolean('enabled', false),
  bgColor: color('bgColor', 'red'),
});

export default () => (
  <ColorButton color="#eee" {...props()}>
    Color Button
  </ColorButton>
);
