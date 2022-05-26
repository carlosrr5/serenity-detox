import { Answerable, AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { DetoxElementInteraction } from './DetoxElementInteraction';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  perform a double-click on a given element.
 *
 * @example
 *<caption>Example widget</caption>
 *
 *      <!--
 *          The editor shows up when the user double-clicks
 *          on one of the properties of their profile
 *          and let's them change the value of that property.
 *      -->
 *      <View testID="container-id">
 *          <Text testID="label-id">{this.textVariable}</Text>
 *          <TouchableWithoutFeedback
 *              testID="button-id"
 *              onPress={() => {
 *                  this.backCount++;
 *                  if(this.backCount == 2) {
 *                      clearTimeout(this.backTimer);
 *                      this.textVariable = "New Text";
 *                  } else {
 *                      this.backTimer(setTimeout() => {
 *                          this.backCount = 0;
 *                      }, 3000);
 *                  }
 *              }}>
 *              <View style={styles.button}>
 *                  <Text>Double Tap Here</Text>
 *              </View>
 *          </TouchableWithoutFeedback>
 *      </View>
 *
 * @example
 *  <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from 'serenity-detox';
 *
 *  class SampleContainer {
 *      static TextLabel = Target.the('Text Label')
 *          .located(by.id('label-id'));
 *      static Button = Target.the('button')
 *          .located(by.id('button-id'));
 *  }
 *
 * @example
 *  <caption>Double-clicking on an element</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { UseTheDevice, DoubleClick, isVisible, Enter, Text, Wait } from 'serenity-detox';
 *  import { Ensure, equals, not } from '@serenity-js/assertions';
 *
 *  actorCalled('Dorothy')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          DoubleClick.on(SampleContainer.Button),
 *          Wait.until(SampleContainer.TextLabel, isVisible()),
 *
 *          Ensure.that(
 *              Text.of(SampleContainer.TextLabel),
 *              equals('New Text'),
 *          ),
 *      );
 *
 * @see {@link Target}
 *
 * @extends {DetoxElementInteraction}
 */
export class DoubleClick extends DetoxElementInteraction {
    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Answerable<Detox.NativeElement>} target
     *  The element to be double-clicked on
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static on(target: Answerable<Detox.NativeElement>): Interaction {
        return new DoubleClick(target);
    }

    /**
     * @param {Answerable<Detox.NativeElement>} target
     *  The element to be double-clicked on
     */
    constructor(private readonly target: Answerable<Detox.NativeElement>) {
        super(formatted`#actor double-clicks on ${target}`);
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
        await element.multiTap(2);
    }
}
