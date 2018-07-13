/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { LOCATION_CHANGE, RouterState, RouterAction, LocationChangeAction } from 'react-router-redux';

import languageProviderReducer, { LanguageState } from 'containers/LanguageProvider/reducer';
import { Reducer, combineReducers } from '../../../node_modules/redux';
import { LanguageAction } from 'containers/LanguageProvider/actions';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState: RouterState = {
  location: null,
};

export type State = {
  route: RouterState,
  language: LanguageState
}

interface TestAction {
  type: "TEST"
}
export type AppAction = LocationChangeAction | RouterAction | LanguageAction | TestAction;
/**
 * Merge route into the global application state
 */
export function routeReducer(state: RouterState = routeInitialState, action?: LocationChangeAction): RouterState {
  if (!action) return state;
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return {
        location: action.payload,
      };
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers?: any): Reducer<State> {
  return combineReducers(
    {
      route: routeReducer,
      language: languageProviderReducer,
      ...injectedReducers,
    }
  );
}
