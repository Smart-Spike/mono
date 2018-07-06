/**
 * Test injectors
 */

import { put } from 'redux-saga/effects';
import { shallow } from 'enzyme';
import * as React from 'react';

import configureStore from '../../configureStore';
import injectSaga from '../injectSaga';

// Fixtures
const Component = () => null;

function* testSaga() {
  yield put({ type: 'TEST', payload: 'yup' });
}

const mockInjectors = {
  injectSaga: jest.fn(),
  ejectSaga: jest.fn(),
};

jest.mock('../sagaInjectors', () => {
  return {
    getInjectors: () => mockInjectors
  }
});

describe('injectSaga decorator', () => {
  let store;
  let ComponentWithSaga;

  beforeEach(() => {
    store = configureStore({}, {});
    ComponentWithSaga = injectSaga({
      key: 'test',
      saga: testSaga,
      mode: 'testMode',
    })(Component);
  });

  it('should inject given saga, mode, and props', () => {
    const props = { test: 'test' };
    shallow(<ComponentWithSaga {...props} />, { context: { store } });

    expect(mockInjectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(mockInjectors.injectSaga).toHaveBeenCalledWith(
      'test',
      { saga: testSaga, mode: 'testMode' },
      props,
    );
  });

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' };
    const renderedComponent = shallow(<ComponentWithSaga {...props} />, {
      context: { store },
    });
    renderedComponent.unmount();

    expect(mockInjectors.ejectSaga).toHaveBeenCalledTimes(1);
    expect(mockInjectors.ejectSaga).toHaveBeenCalledWith('test');
  });

  it('should set a correct display name', () => {
    expect(ComponentWithSaga.displayName).toBe('withSaga(Component)');
    expect(
      injectSaga({ key: 'test', saga: testSaga, mode: '' })(() => null).displayName,
    ).toBe('withSaga(Component)');
  });

  it('should propagate props', () => {
    const props = { testProp: 'test' };
    const renderedComponent = shallow(<ComponentWithSaga {...props} />, {
      context: { store },
    });

    expect(renderedComponent.prop('testProp')).toBe('test');
  });
});
