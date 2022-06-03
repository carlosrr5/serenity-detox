import { Expectation, ExpectationMet, ExpectationNotMet, ExpectationOutcome } from '@serenity-js/core';

import { UseTheDevice } from '../screenplay';

/**
 * @access private
 */
export class ElementExpectation extends Expectation<any, Detox.NativeElement> {
    static forElementTo(
        message: string,
        fn: (actual: Detox.Expect) => Promise<boolean>,
    ): Expectation<boolean, Detox.NativeElement> {
        return new ElementExpectation(message, fn);
    }

    constructor(subject: string, private readonly fn: (actual: Detox.Expect) => Promise<boolean>) {
        super(subject);
    }

    answeredBy(): (
        actual: Detox.NativeElement,
    ) => Promise<ExpectationOutcome<any, Detox.NativeElement>> {
        return async (actual: Detox.NativeElement) => {
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
