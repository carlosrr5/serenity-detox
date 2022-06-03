import { Expectation } from '@serenity-js/core';

import { ElementExpectation } from './ElementExpectation';

/**
 * @desc
 *  Expects a toggle-able element (e.g. a Switch or a Check-Box) to
 *  be on/checked or off/unchecked. As a reference, in react-native,
 *  this is the equivalent switch component.
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Detox.NativeElement>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect#tohavetogglevaluevalue
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isSelected(): Expectation<boolean, Detox.NativeElement> {
    return ElementExpectation.forElementTo('become selected', async (actual) => {
        try {
            await actual.toHaveToggleValue(true);
            return true;
        } catch {
            return false;
        }
    });
}
