import { Expectation } from '@serenity-js/core';

import { ElementExpectation } from './ElementExpectation';

/**
 * @desc
 *  Expectation that the element is active (has focus).
 *  If the selector matches multiple elements, it will return true if one of the elements has focus.
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Detox.NativeElement>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect#tobefocused
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isActive(): Expectation<boolean, Detox.NativeElement> {
    return ElementExpectation.forElementTo('become active', async (actual) => {
        try {
            await actual.toBeFocused();
            return true;
        } catch {
            return false;
        }
    });
}
