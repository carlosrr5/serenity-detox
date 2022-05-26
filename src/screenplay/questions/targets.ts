import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';

import { Locator } from './locators';
import { TargetBuilder } from './TargetBuilder';

/**
 * @desc
 *  Provides a convenient way to retrieve a single element,
 *  so that they can be used with Serenity/JS {@link @serenity-js/core/lib/screenplay~Interaction}s.
 *
 *  Check out the examples below, as well as the unit tests demonstrating the usage.
 *
 *  @example
 *<caption>Imaginary website under test</caption>
 *
 *      <View>
 *          <Text testID="summary">
 *              Coconut is not available
 *          </Text>
 *          <Button testID="submit">Proceed to Checkout</button>
 *      </View>
 *
 *  @example
 *<caption>Locating a single element</caption>
 *   import { by, Target, TargetElement } from 'serenity-detox';
 *
 *   const proceedToCheckoutButton: TargetElement =
 *       Target.the('Proceed to Checkout button').located(by.id('submit'));
 *
 *  @example
 *<caption>Clicking on an element</caption>
 *   import { actorCalled } from '@serenity-js/core';
 *   import { UseTheDevice, Click } from 'serenity-detox';
 *
 *   actorCalled('Jane')
 *       .whoCan(UseTheDevice.now())
 *       .attemptsTo(
 *           Click.on(proceedToCheckoutButton),
 *       );
 *
 *  @example
 *<caption>Waiting on an element</caption>
 *   import { actorCalled } from '@serenity-js/core';
 *   import { UseTheDevice, Wait, isClickable } from 'serenity-detox';
 *
 *   actorCalled('Jane')
 *       .whoCan(UseTheDevice.now())
 *       .attemptsTo(
 *           Wait.until(proceedToCheckoutButton, isClickable()),
 *       );
 */
export class Target {
    /**
     * @desc
     *  Locates a single Web element
     *
     * @param {string} description
     *  A human-readable name of the element, which will be used in the report
     *
     * @returns {TargetBuilder<TargetElement>}
     */
    static the(description: string): TargetBuilder<TargetElement> {
        return {
            located(locator: Locator): TargetElement {
                return new TargetElement(`the ${ description }`, locator);
            },
        }
    }
}

/**
 * @desc
 *  You probably don't want to use this class directly. See {@link Target} instead.
 *
 * extends {Question}
 * @implements {@serenity-js/core/lib/screenplay/questions~MetaQuestion}
 *
 * @see {@link Target}
 */
export class TargetElement
    extends Question<Detox.NativeElement>
{
    constructor(
        description: string,
        private readonly locator: Locator,
    ) {
        super(description);
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Detox.NativeElement {
        return this.locator.firstMatching()
            .describedAs(this.subject)
            .answeredBy(actor);
    }
}
