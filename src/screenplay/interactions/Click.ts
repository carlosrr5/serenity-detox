import { Answerable, AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { DetoxElementInteraction } from './DetoxElementInteraction';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  [click/tap](https://wix.github.io/Detox/docs/api/actions-on-element#tappoint) on a given element.
 *
 * @example <caption>Example widget</caption>
 *  <View>
 *    <Button name="example" testId="example" />
 *  </View>
 *
 * @example <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from 'serenity-detox';
 *
 *  class Form {
 *      static exampleButton = Target.the('example button')
 *          .located(by.id('example'));
 *  }
 *
 * @example <caption>Clicking on an element</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { UseTheDevice, Click } from 'serenity-detox';
 *
 *  actorCalled('Fermin')
 *      .attemptsTo(
 *          Click.on(Form.exampleButton),
 *      );
 *
 * @see {@link UseTheDevice}
 * @see {@link Target}
 *
 * @extends {DetoxElementInteraction}
 */
export class Click extends DetoxElementInteraction {
    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Answerable<Detox.IndexableNativeElement>} target
     *  The element to be clicked on
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static on(target: Answerable<Detox.NativeElement>): Interaction {
        return new Click(target);
    }

    /**
     * @param {Answerable<Detox.NativeElement>} target
     *  The element to be clicked on
     */
    constructor(private readonly target: Answerable<Detox.NativeElement>) {
        super(formatted`#actor clicks on ${target}`);
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
        const element = await this.resolve(actor, this.target);
        await element.tap();
    }
}
