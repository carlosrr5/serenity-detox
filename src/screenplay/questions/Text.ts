import { Answerable, AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';

/**
 * @desc
 *  Resolves to the visible (i.e. not hidden by CSS) `innerText` of:
 *  - a given {@link Detox.NativeElement}, represented by Answerable<{@link Detox.NativeElement}>
 *  - a group of {@link Detox.NativeElement}s, represented by Answerable<{@link Detox.IndexableNativeElement}>
 *
 *  The result includes the visible text of any sub-elements, without any leading or trailing whitespace.
 *
 * @example
 *<caption>Example widget</caption>
 *
 *      <Text testID="header">Shopping list</Text>
 *      <View testID="shopping-list">
 *          <Text testID="item">Coffee<Text>
 *          <Text testID="item">Honey<Text>
 *          <Text testID="item">Chocolate<Text>
 *      </View>
 *
 * @example
 *<caption>Retrieve text of a single element</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *  import { UseTheDevice, by, Target, Text } from 'serenity-detox';
 *
 *  const header = () =>
 *      Target.the('header').located(by.id('header'))
 *
 *  actorCalled('Lisa')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Ensure.that(Text.of(header()), equals('Shopping list')),
 *      )
 *
 * @example
 *<caption>Retrieve text of a multiple elements</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *  import { UseTheDevice, by, Target, Text } from 'serenity-detox';
 *
 *  const shoppingListItems = () =>
 *      Target.the('shopping list items').located(by.id('item'))
 *
 *  actorCalled('Lisa')
 *      .whoCan(UseTheDevice.now())
 *      .attemptsTo(
 *          Ensure.that(
 *              Text.ofAll(shoppingListItems()),
 *              equals([ 'Coffee', 'Honey', 'Chocolate' ])
 *          ),
 *      )
 *
 * @public
 * @see {@link Target}
 */
export class Text {

    /**
     * @desc
     *  Retrieves text of a single {@link Detox.NativeElement},
     *  represented by Answerable<{@link Detox.NativeElement}>.
     *
     * @param {Answerable<Detox.NativeElement>} element
     * @returns {Question<Promise<string>> | MetaQuestion<Answerable<Detox.NativeElement>, Promise<string>>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/questions~MetaQuestion}
     */
    static of(element: Answerable<Detox.NativeElement>): Question<Promise<string>> {
        return new TextOfSingleElement(element);
    }

    /**
     * @desc
     *  Retrieves text of a group of {@link Detox.NativeElement}s,
     *  represented by Answerable<{@link Detox.IndexableNativeElement}>
     *
     * @param {Answerable<Detox.IndexableNativeElement>} elements
     * @returns {Question<Promise<string[]>> | MetaQuestion<Answerable<Detox.NativeElement>, Promise<string[]>>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/questions~MetaQuestion}
     */
    static ofAll(elements: Answerable<Detox.IndexableNativeElement>): Question<Promise<string[]>> {
        return new TextOfMultipleElements(elements);
    }
}

class TextOfSingleElement
    extends Question<Promise<string>>
{
    constructor(private readonly element: Answerable<Detox.NativeElement>) {
        super(`the text of ${ element }`);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        actor.answer(this.element)
            .then(element => element.getAttributes())
        const element = await actor.answer(this.element);
        const attributes = <Detox.ElementAttributes>(await element.getAttributes());
        const elementText = attributes.text;
        return elementText;
    }
}

class TextOfMultipleElements
    extends Question<Promise<string[]>>
{
    constructor(private readonly elements: Answerable<Detox.IndexableNativeElement>) {
        super(`the text of ${ elements }`);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string[]> {
        const indexableElements = await actor.answer(this.elements);
        const { elements } = <{elements: Detox.ElementAttributes[]}>(await indexableElements.getAttributes());
        return Promise.all(elements.map(answer => answer.text));
    }
}
