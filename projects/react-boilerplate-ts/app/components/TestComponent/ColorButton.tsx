import * as React from 'react';

export enum someEnum {
  Trevor = 'TREVOR',
  Bob = 'BOB',
}

export interface ColorButtonProps {
  /** Text color */
  color: 'white' | '#eee';
  /** Background color */
  bgColor?: string;
  /** Is button enabled or disabled? */
  enabled?: boolean;
  /** An example enum value */
  someType?: someEnum;
}

/** A button with a configurable background color. */
export const ColorButton: React.SFC<ColorButtonProps> = props => (
  <button
    style={{
      padding: 40,
      color: props.color,
      backgroundColor: props.bgColor,
      fontSize: '2rem',
      opacity: props.enabled ? 1 : 0.4,
    }}
    disabled={!props.enabled}
  >
    {props.children} ({props.someType})
  </button>
);

ColorButton.defaultProps = {
  bgColor: 'blue',
  enabled: true,
  someType: someEnum.Trevor,
};

export default ColorButton;
