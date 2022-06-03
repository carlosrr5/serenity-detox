import { Expectation } from '@serenity-js/core';

import { ElementExpectation } from './ElementExpectation';

/**
 * @desc
 *  Expectation that an element is clickable, which means:
 *  - it exists
 *  - it is visible
 *  - it is within viewport
 *  - its center is not overlapped with another element
 *  otherwise return false.
 *
 *  Any visible element will be reported as clickable even when disabled.
 *
 * @example <caption>How to handle disabled buttons</caption>
 *  <View>
 *      <Button
 *          disabled={isDisabled}
 *          title="Continue"
 *          testID={`buttonExample${isDisabled ? "_disabled" : ""}`}
 *      />
 *  </View>
 *
 * @returns {@serenity-js/core/lib/screenplay/questions~Expectation<boolean, Detox.NativeElement>}
 *
 * @see https://wix.github.io/Detox/docs/api/expect
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/core/lib/screenplay/questions~Check}
 * @see {@link Wait}
 */
export function isClickable(): Expectation<boolean, Detox.NativeElement> {
    return ElementExpectation.forElementTo('become clickable', async (actual) => {
        try {
            await actual.toBeVisible();
        } catch {
            return false;
        }
        return true;
    });
}
