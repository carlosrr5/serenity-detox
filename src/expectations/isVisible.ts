import { Expectation } from '@serenity-js/core';

import { ElementExpectation } from './ElementExpectation';

/**
 * @desc
 *  Expect the view to be at least 75% visible.
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Detox.Element>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect#tobevisible
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isVisible(): Expectation<boolean, Detox.IndexableNativeElement> {
    return ElementExpectation.forElementTo('become visible', async (actual) => {
        try {
            await actual.toBeVisible();
        } catch {
            return false;
        }
        return true;
    });
}
