/*
 *
 * LanguageProvider actions
 *
 */

import { CHANGE_LOCALE } from './constants';

export type LanguageAction = ChangeLocaleAction;

export interface ChangeLocaleAction {
  type: typeof CHANGE_LOCALE,
  locale: string
};

export function changeLocale(languageLocale: string): ChangeLocaleAction {
  return {
    type: CHANGE_LOCALE,
    locale: languageLocale,
  };
}
