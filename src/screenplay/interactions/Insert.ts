import { Answerable, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { DetoxElementInteraction } from './DetoxElementInteraction';
import { EnterBuilder } from './EnterBuilder';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  enter a value into a Input field.
 *
 * @example
 *  <caption>Example widget</caption>
 *  <View>
 *      <Input testID="example" />
 *  </View>
 *
 * @example
 *  <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from 'serenity-detox';
 *
 *  class Form {
 *      static exampleInput = Target.the('example input')
 *          .located(by.id('example'));
 *  }
 *
 * @example
 *  <caption>Entering the value into a input field</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { UseTheDevice, Enter } from 'serenity-detox';
 *
 *  actorCalled('Esme')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Enter.theValue('Hello world!').into(Form.exampleInput),
 *      );
 *
 * @see {@link Target}
 *
 * @extends {DetoxElementInteraction}
 */
export class Insert extends DetoxElementInteraction {
    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Array<Answerable<string | number | string[] | number[]>>} value
     *  The value to be entered
     *
     * @returns {EnterBuilder}
     */
    static theValue(...value: Answerable<string | number | string[] | number[]>[]): EnterBuilder {
        return {
            into: (field: Answerable<Detox.IndexableNativeElement> /* todo Question<AlertPromise> | AlertPromise */) =>
                new Insert(value, field),
        };
    }

    /**
     * @param {Array<Answerable<string | number | string[] | number[]>>} value
     *  The value to be entered
     *
     * @param {Answerable<Detox.IndexableNativeElement>} field
     *  The field to enter the value into
     */
    constructor(
        private readonly value: Answerable<string | number | string[] | number[]>[],
        private readonly field: Answerable<Detox.IndexableNativeElement> /* todo | Question<AlertPromise> | AlertPromise */,
    ) {
        super(formatted`#actor inserts the value ${value.join(', ')} into ${field}`);
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  perform this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Actor} actor
     *  An {@link @serenity-js/core/lib/screenplay/actor~Actor} to perform this {@link @serenity-js/core/lib/screenplay~Interaction}
     *
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     */
    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const values = await Promise.all(this.value.map((part) => actor.answer(part)));
        const field = await this.resolve(actor, this.field);

        // typeText rather than replaceText so that the behaviour is consistent with Selenium sendKeys
        await field.replaceText(values.flat().toString());
    }
}
