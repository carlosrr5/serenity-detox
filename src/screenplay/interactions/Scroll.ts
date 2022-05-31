import { Answerable, AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { UseTheDevice } from '../abilities';
import { DetoxElementInteraction } from './DetoxElementInteraction';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  scroll until a given Web element comes into view.
 *
 * @example <caption>Example widget</caption>
 *
 *      <!--
 *          an element somewhere at the bottom of the page,
 *          outside of the visible area
 *      -->
 *      <input type="submit" id="submit" />
 *
 * @example <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from '@serenity-js/webdriverio';
 *
 *  class Form {
 *      static submitButton = Target.the('submit button')
 *          .located(by.id('submit'));
 *  }
 *
 * @example <caption>Scrolling to element</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { Ensure } from '@serenity-js/assertions';
 *  import { UseTheDevice, Scroll, isVisible } from 'serenity-detox';
 *
 *  actorCalled('Sara')
 *      .whoCan(UseTheDevice.using(browser))
 *      .attemptsTo(
 *          Scroll.to(Form.submitButton),
 *          Ensure.that(Form.submitButton, isVisible()),
 *      );
 *
 * @see {@link UseTheDevice}
 * @see {@link Target}
 * @see {@link isVisible}
 * @see {@link @serenity-js/assertions~Ensure}
 */
export class Scroll {
    static on(scrollView: Answerable<Detox.NativeElement>, direction: 'up' | 'down' = 'down'): Interaction {
        return new ScrollOn(scrollView, direction)
    }
    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Answerable<Detox.NativeElement>} target
     *  The element to be scrolled to
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static to(target: Answerable<Detox.NativeElement>): { on: typeof Scroll.on } {
        return {
            on: (scrollView: Answerable<Detox.NativeElement>, direction: 'up' | 'down' = 'down'): Interaction =>
                new ScrollOn(scrollView, direction, target),
        }
    }
}

/*interface ScrollBuilder {
    on: (scrollView: Answerable<Detox.NativeElement>, direction: 'up' | 'down') => Interaction;
}*/

class ScrollOn extends DetoxElementInteraction {
    /**
     * @param {Answerable<Detox.NativeElement>} target
     *  The element to be scrolled to
     */
    constructor(private readonly baseElement: Answerable<Detox.NativeElement>, private readonly direction: 'up' | 'down', private readonly target?: Answerable<Detox.NativeElement>) {
        super(formatted`#actor scrolls${target ? ` to ${target}` : ''} on ${baseElement}`);
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
        const element = await this.resolve(actor, this.baseElement);
        if (this.target) {
            for (let i = 0; i<3; i++) {
                try {
                    const targetElement = await this.resolve(actor, this.target);
                    await UseTheDevice.expect(targetElement).toBeVisible();
                    break;
                } catch {
                    await element.scroll(200, this.direction);
                }
            }
        } else {
            await element.scroll(200, this.direction);
        }
    }
}
