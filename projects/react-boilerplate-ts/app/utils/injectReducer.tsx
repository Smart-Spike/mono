import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getInjectors } from './reducerInjectors';

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default ({ key, reducer }) => WrappedComponent => {
  class ReducerInjector extends React.Component {
    private injectors = getInjectors(this.context.store);
    private static WrappedComponent = WrappedComponent;
    public static displayName = `withReducer(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    public componentWillMount() {
      const { injectReducer } = this.injectors;

      injectReducer(key, reducer);
    }

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
