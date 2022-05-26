import { Expectation } from '@serenity-js/core';

import { ElementExpectation } from './ElementExpectation';

/**
 * @desc
 *  Expectation that the element is present in the View tree.
 *  Please note that this does not necessarily mean that the element is visible.
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Element<'async'>>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect#toexist
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isPresent(): Expectation<boolean, Detox.IndexableNativeElement> {
    return ElementExpectation.forElementTo('become present', async (actual) => {
        try {
            await actual.toExist();
        } catch {
            return false;
        }
        return true;
    });
}
