import {
    Answerable,
    AnswersQuestions,
    AssertionError,
    Duration,
    Expectation,
    ExpectationMet,
    ExpectationOutcome,
    Interaction,
    UsesAbilities,
} from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { UseTheDevice } from '../abilities';
import { WaitBuilder } from './WaitBuilder';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  wait before proceeding either for a set {@link @serenity-js/core/lib/model~Duration}
 *  or until a given {@link Expectation} is met.
 *
 *  Under the hood, `Wait` uses Detox ["expect"](https://wix.github.io/Detox/docs/api/expect)
 *  mechanism.
 *
 * @example
 *<caption>Example widget</caption>
 *
 *      <!--
 *          After about 1 second, the text will change from 'Loading...' to 'Ready!'
 *      -->
 *      <Text testID="status">{this.isReady ? 'Ready!' : 'Loading...'}</Text>
 *      <Countdown
 *          toDate={Date.now() + 1000}
 *          callback={() => {
 *              this.isReady = true;
 *          }} />
 *
 * @example
 *<caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from 'serenity-detox';
 *
 *  class App {
 *      static status = Target.the('status widget')
 *          .located(by.id('status'));
 *  }
 *
 * @example
 *<caption>Waiting for a set amount of time</caption>
 *  import { actorCalled, Duration } from '@serenity-js/core';
 *  import { UseTheDevice, Wait } from 'serenity-detox';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *
 *  actorCalled('Wendy')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Wait.for(Duration.ofSeconds(1.5)),
 *          Ensure.that(App.status, equals('Ready!')),
 *      );
 *
 *  // Please note that while the above implementation works,
 *  // this approach is inefficient because at best
 *  // the actor might wait too long and at worst the test
 *  // might become "flaky" if any external interference
 *  // (like network glitches, animations taking a bit too long etc.)
 *  // makes the actor wait not long enough.
 *
 * @example
 *<caption>Waiting until a condition is met</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { UseTheDevice, Wait, Text } from '@serenity-detox';
 *  import { equals } from '@serenity-js/assertions';
 *
 *  actorCalled('Wendy')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Wait.until(Text.of(App.status), equals('Ready!')),
 *          // app is ready, proceed with the scenario
 *      );
 *
 *  // Wait.until makes the Actor keep asking a Question,
 *  // in this case Text.of(App.status), until the answer meets
 *  // the expectation, or a timeout expires (default: 5s).
 *  //
 *  // Please note that both Ensure and Wait can be used with
 *  // the same expectations, like `equals`.
 *
 * @example
 *<caption>Changing the default timeout</caption>
 *  import { actorCalled, Duration } from '@serenity-js/core';
 *  import { UseTheDevice, Wait, Text } from 'serenity-detox';
 *  import { equals } from '@serenity-js/assertions';
 *
 *  actorCalled('Wendy')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Wait.upTo(Duration.ofSeconds(3))
 *              .until(Text.of(App.status), equals('Ready!')),
 *          // app is ready, proceed with the scenario
 *      );
 *
 * @see {@link UseTheDevice}
 * @see {@link Target}
 * @see {@link Text}
 * @see {@link @serenity-js/assertions~Ensure}
 * @see {@link @serenity-js/assertions/lib/expectations~equals}
 * @see {@link @serenity-js/core/lib/model~Duration}
 *
 * @see {@link @serenity-js/core/lib/screenplay~Interaction}
 */
export class Wait {
    /**
     * @desc
     *  Default timeout of 5 seconds used with {@link Wait.until}.
     *
     * @type {@serenity-js/core~Duration}
     */
    static readonly Default_Timeout = Duration.ofSeconds(5);

    /**
     * @desc
     *  Instantiates a version of this {@link @serenity-js/core/lib/screenplay~Interaction}
     *  configured to wait for a set duration.
     *
     * @param {Answerable<Duration>} duration
     *  A set duration the {@link @serenity-js/core/lib/screenplay/actor~Actor} should wait for
     *  before proceeding
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static for(duration: Answerable<Duration>): Interaction {
        return new WaitFor(duration);
    }

    /**
     * @desc
     *  Instantiates a version of this {@link @serenity-js/core/lib/screenplay~Interaction}
     *  configured to wait until the answer to the question (`actual`) meets the `expectation`,
     *  or a custom timeout expires.
     *
     * @param {Duration} duration
     *  Custom timeout to override {@link Wait.Default_Timeout}
     *
     * @returns {WaitBuilder}
     */
    static upTo(duration: Duration): WaitBuilder {
        return {
            until: <Actual>(actual: Answerable<Actual>, expectation: Expectation<any, Actual>): Interaction =>
                new WaitUntil(actual, expectation, duration),
        };
    }

    /**
     * @desc
     *  Instantiates a version of this {@link @serenity-js/core/lib/screenplay~Interaction}
     *  configured to wait until the answer to the question (`actual`) meets the `expectation`,
     *  or a {@link Wait.Default_Timeout} expires.
     *
     * @param {Answerable<Actual>} actual
     *  A {@link @serenity-js/core/lib/screenplay~Question}
     *  that the {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  will keep asking until the answer meets
     *  the {@link @serenity-js/core/lib/screenplay/questions~Expectation} provided
     *
     * @param {@serenity-js/core/lib/screenplay/questions~<any,Actual>} expectation
     *  An {@link @serenity-js/core/lib/screenplay/questions~Expectation} to be met before proceeding
     *
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     */
    static until<Actual>(actual: Answerable<Actual>, expectation: Expectation<any, Actual>): Interaction {
        return new WaitUntil(actual, expectation, Wait.Default_Timeout);
    }
}

/**
 * @package
 */
class WaitFor extends Interaction {
    constructor(private readonly duration: Answerable<Duration>) {
        super();
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  perform this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Actor} actor
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     */
    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        return actor
      .answer(this.duration)
      .then((duration) => UseTheDevice.as(actor).pause(duration));
    }

    /**
     * @desc
     *  Generates a description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Activity}.
     *
     * @returns {string}
     */
    toString(): string {
        return formatted`#actor waits for ${this.duration}`;
    }
}

/**
 * @package
 */
class WaitUntil<Actual> extends Interaction {
    constructor(
        private readonly actual: Answerable<Actual>,
        private readonly expectation: Expectation<any, Actual>,
        private readonly timeout: Duration,
    ) {
        super();
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  perform this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Actor} actor
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     */
    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        const actual = this.actual,
            expectation = this.expectation.answeredBy(actor);

        let expectationOutcome: ExpectationOutcome<any, Actual>;

        return this.waitUntil(
            async function () {
                const act = await actor
                   .answer(actual);
                const outcome = await expectation(act);
                expectationOutcome = outcome;
                return outcome instanceof ExpectationMet;
            },
            {
                timeout: this.timeout.inMilliseconds(),
                timeoutMsg: `Wait timed out after ${this.timeout}`,
            },
        )
      .catch((error) => {
          if (expectationOutcome) {
              throw new AssertionError(
                  `Waited ${this.timeout.toString()} for ${formatted`${this.actual}`} to ${this.expectation.toString()}`,
                  expectationOutcome.expected,
                  expectationOutcome.actual,
                  error,
              );
          }
          throw error;
      });
    }

    private async waitUntil(fn: () => Promise<boolean>, timeout: { timeout: number; timeoutMsg: string }): Promise<void> {
        let interval: any;
        await Promise.race([
            new Promise<void>((resolve) => {
                interval = setInterval(async () => {
                    if (await fn()) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            }),
            new Promise((resolve_1, reject) => setTimeout(() => {
                clearInterval(interval);
                reject(timeout.timeoutMsg);
            }, timeout.timeout)),
        ]);
    }

    /**
     * @desc
     *  Generates a description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Activity}.
     *
     * @returns {string}
     */
    toString(): string {
        return formatted`#actor waits up to ${this.timeout} until ${this.actual} does ${this.expectation}`;
    }
}
