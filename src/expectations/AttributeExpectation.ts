import { Expectation, ExpectationMet, ExpectationNotMet, ExpectationOutcome } from '@serenity-js/core';

/**
 * @access private
 */
export class AttributeExpectation extends Expectation<any, Detox.IndexableNativeElement> {
    static forElementTo(
        message: string,
        fn: (actual: Detox.ElementAttributes) => Promise<boolean>,
    ): Expectation<boolean, Detox.IndexableNativeElement> {
        return new AttributeExpectation(message, fn);
    }

    constructor(subject: string, private readonly fn: (actual: Detox.ElementAttributes) => Promise<boolean>) {
        super(subject);
    }

    answeredBy(): (
        actual: Detox.IndexableNativeElement,
    ) => Promise<ExpectationOutcome<any, Detox.IndexableNativeElement>> {
        return async (actual: Detox.IndexableNativeElement) => {
            try {
                const outcome = await this.fn(<Detox.ElementAttributes>(await actual.getAttributes()))
                return outcome
                    ? new ExpectationMet(this.toString(), undefined, actual)
                    : new ExpectationNotMet(this.toString(), undefined, actual);
            } catch {
                return new ExpectationNotMet(this.toString(), undefined, actual);
            }
        }
    }
}
