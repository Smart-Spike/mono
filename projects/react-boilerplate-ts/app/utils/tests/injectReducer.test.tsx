/**
 * Test injectors
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import { identity } from 'lodash';

import configureStore from '../../configureStore';
import injectReducer from '../injectReducer';

// Fixtures
const Component = () => null;

const reducer = identity;

const mockInjectors = {
  injectReducer: jest.fn()
};

jest.mock('../reducerInjectors', () => {
  return {
    getInjectors: () =>  mockInjectors
  }
});

describe('injectReducer decorator', () => {
  let store;
  let ComponentWithReducer;

  beforeEach(() => {
    store = configureStore({}, {});
    ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component);
  });

  it('should inject a given reducer', () => {
    shallow(<ComponentWithReducer />, { context: { store } });

    expect(mockInjectors.injectReducer).toHaveBeenCalledTimes(1);
    expect(mockInjectors.injectReducer).toHaveBeenCalledWith('test', reducer);
  });

  it('should set a correct display name', () => {
    expect(ComponentWithReducer.displayName).toBe('withReducer(Component)');
    expect(
      injectReducer({ key: 'test', reducer })(() => null).displayName,
    ).toBe('withReducer(Component)');
  });

  it('should propagate props', () => {
    const props = { testProp: 'test' };
    const renderedComponent = shallow(<ComponentWithReducer {...props} />, {
      context: { store },
    });

    expect(renderedComponent.prop('testProp')).toBe('test');
  });
});
