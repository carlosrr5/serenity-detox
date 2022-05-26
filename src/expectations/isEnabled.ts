import { Expectation } from '@serenity-js/core';

import { AttributeExpectation } from './AttributeExpectation';

/**
 * @desc
 *  Expectation that the element is enabled.
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Detox.IndexableNativeElement>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isEnabled(): Expectation<boolean, Detox.IndexableNativeElement> {
    return AttributeExpectation.forElementTo('become enabled', async actual => {
        return actual.enabled;
    });
}
