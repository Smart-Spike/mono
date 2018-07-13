/*
 *
 * LanguageProvider reducer
 *
 */

import { CHANGE_LOCALE } from './constants';
import { DEFAULT_LOCALE } from '../../i18n';
import { ChangeLocaleAction } from './actions';
import { AppAction } from 'reducers';

export interface LanguageState {
  locale: string 
}

export const initialState: LanguageState = {
  locale: DEFAULT_LOCALE,
};

export const handlers = {
  [CHANGE_LOCALE]: (state: LanguageState, action: ChangeLocaleAction): LanguageState => ({
      locale: action.locale
  })
};
export default ( state: LanguageState = initialState, action: AppAction) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};
