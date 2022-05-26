import { Answerable, AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

/**
 * @desc
 *  Returns the `value` attribute of a given {@link Detox.NativeElement},
 *  represented by Answerable<{@link Detox.NativeElement}>
 *
 * @example <caption>Example widget</caption>
 *  <Input testID="username"/>
 *
 * @example
 *<caption>Retrieve value of a given Element</caption>
 *
 *      import { actorCalled } from '@serenity-js/core';
 *      import { Ensure, equals } from '@serenity-js/assertions';
 *      import { UseTheDevice, by, Value, Target } from 'serenity-detox';
 *
 *      const usernameField = () =>
 *          Target.the('username field').located(by.id('username'))
 *
 *          actorCalled('Lisa')
 *              .whoCan(UseTheDevice.now())
 *              .attemptsTo(
 *                  Ensure.that(Value.of(usernameField), equals('user@example.org')),
 *              )
 *
 * extends {@serenity-js/core/lib/screenplay~Question}
 * @implements {@serenity-js/core/lib/screenplay/questions~MetaQuestion}
 */
export class Value
    extends Question<Promise<string>>
{
    /**
     * @param {Answerable<Detox.NativeElement>} element
     * @returns {Value}
     */
    static of(element: Answerable<Detox.NativeElement>): Question<Promise<string>> {
        return new Value(element);
    }

    /**
     * @param {Answerable<Detox.NativeElement>} element
     */
    constructor(private readonly element: Answerable<Detox.NativeElement>) {
        super(formatted`the value of ${ element }`);
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  answer this {link @serenity-js/core/lib/screenplay~Question}.
     *
     * @param {Actor} actor
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     */
    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        const element = await actor.answer(this.element);
        const attributes = <Detox.ElementAttributes>(await element.getAttributes());

        return `${attributes.value}`;
    }
}
