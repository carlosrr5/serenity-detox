import { Expectation, ExpectationMet, ExpectationNotMet, ExpectationOutcome } from '@serenity-js/core';

import { UseTheDevice } from '../screenplay';

/**
 * @access private
 */
export class ElementExpectation extends Expectation<any, Detox.IndexableNativeElement> {
    static forElementTo(
        message: string,
        fn: (actual: Detox.Expect) => Promise<boolean>,
    ): Expectation<boolean, Detox.IndexableNativeElement> {
        return new ElementExpectation(message, fn);
    }

    constructor(subject: string, private readonly fn: (actual: Detox.Expect) => Promise<boolean>) {
        super(subject);
    }

    answeredBy(): (
        actual: Detox.IndexableNativeElement,
    ) => Promise<ExpectationOutcome<any, Detox.IndexableNativeElement>> {
        return async (actual: Detox.IndexableNativeElement) => {
            try {
                const outcome = await this.fn(UseTheDevice.expect(actual))
                return outcome
                    ? new ExpectationMet(this.toString(), undefined, actual)
                    : new ExpectationNotMet(this.toString(), undefined, actual);
            } catch {
                return new ExpectationNotMet(this.toString(), undefined, actual);
            }
        }
    }
}
