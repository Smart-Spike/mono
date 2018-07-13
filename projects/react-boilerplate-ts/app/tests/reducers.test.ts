/**
 * Test route reducer
 */

import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';
import { routeReducer } from '../reducers';

describe('route reducer', () => {
  it('should return the initial state', () => {
    const initialState = { location: null };
    expect(routeReducer(initialState)).toEqual(initialState);
  });

  it('should handle the location_change action correctly', () => {
    const state = {
      location: {
        pathname: 'fod',
        search: 'bai',
        state: 8,
        hash: 'hahy'
      }
    };
    const payload = {
      pathname: 'foo',
      search: 'bar',
      state: 3,
      hash: 'hashy'
    };
    const action: LocationChangeAction = { type: LOCATION_CHANGE, payload };

    const expectedState = { location: payload };
    const resultState = routeReducer(state, action);
    expect(resultState).toEqual(expectedState);
  });
});
