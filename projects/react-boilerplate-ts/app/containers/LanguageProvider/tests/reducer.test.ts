import { handlers, default as reducer } from '../reducer';
import { CHANGE_LOCALE } from '../constants';

describe('handlers', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: "TEST" })).toEqual(
      {
        locale: 'en',
      },
    );
  });

  it('changes the locale', () => {
    expect(
      handlers[CHANGE_LOCALE](undefined, {
        type: CHANGE_LOCALE,
        locale: 'de',
      }),
    ).toEqual({
      locale: 'de',
    });
  });
});
