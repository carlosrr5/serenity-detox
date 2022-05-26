import { Answerable, AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { DetoxElementInteraction } from './DetoxElementInteraction';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  clear the `value` of an Input field.
 *
 * @example <caption>Example widget</caption>
 *  <View>
 *    <Input testID="example" />
 *  </View>
 *
 * @example <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from 'serenity-detox';
 *
 *  class Form {
 *      static exampleInput = Target.the('example input')
 *          .located(by.id('example'));
 *  }
 *
 * @example <caption>Clearing the value of an input field</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *  import { BrowseTheWeb, Clear, Enter, Value } from 'serenity-detox';
 *
 *  actorCalled('Inés')
 *      .whoCan(BrowseTheWeb.using(browser))
 *      .attemptsTo(
 *          Enter.theValue('Hello world!').into(Form.exampleInput),
 *          Ensure.that(Value.of(Form.exampleInput), equals('Hello world!')),
 *
 *          Clear.theValueOf(Form.exampleInput),
 *          Ensure.that(Value.of(Form.exampleInput), equals('')),
 *      );
 *
 * @see {@link BrowseTheWeb}
 * @see {@link Enter}
 * @see {@link Value}
 * @see {@link Target}
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/assertions/lib/expectations~equals}
 *
 * @extends {DetoxElementInteraction}
 */
export class Clear extends DetoxElementInteraction {

    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Answerable<Detox.NativeElement>} field
     *  The field to be cleared
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static theValueOf(field: Answerable<Detox.NativeElement>): Interaction {
        return new Clear(field);
    }

    /**
     * @param {Answerable<Detox.NativeElement>} field
     *  The element to be cleared
     */
    constructor(private readonly field: Answerable<Detox.NativeElement>) {
        super(formatted `#actor clears the value of ${ field }`);
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  perform this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Actor} actor
     *  An {@link @serenity-js/core/lib/screenplay/actor~Actor} to perform this {@link @serenity-js/core/lib/screenplay~Interaction}
     *
     * @returns {PromiseLike<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     */
    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const element   = await this.resolve(actor, this.field);
        return element.clearText();
    }
}
