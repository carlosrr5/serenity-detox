import { Question } from '@serenity-js/core';

import { UseTheDevice } from '../abilities';

/**
 * @desc
 *  Represents a way to retrieve one and multiple Detox elements using a given strategy.
 *
 * @see {@link by}
 * @see {@link Locators}
 */
export class Locator {
    constructor(
        private readonly description: string,
        private readonly locateOne: (by: Detox.ByFacade) => Detox.NativeMatcher,
        private readonly locateAll: (by: Detox.ByFacade) => Detox.NativeMatcher,
    ) {}

    /**
     * @desc
     *  Returns a {@link @serenity-js/core/lib/screenplay~Question} that resolves
     *  to the first Web element found using a given strategy.
     *
     * returns {@serenity-js/core/lib/screenplay~Question}
     */
    firstMatching(): Question<Detox.NativeElement> {
        return Question.about(this.description, (actor) => UseTheDevice.as(actor).element(this.locateOne).atIndex(0));
    }

    /**
     * @desc
     *  Returns a {@link @serenity-js/core/lib/screenplay~Question} that resolves
     *  to all the Web elements found using a given strategy.
     *
     * @returns {@serenity-js/core/lib/screenplay~Question}
     */
    allMatching(): Question<Detox.IndexableNativeElement> {
        return Question.about(this.description, (actor) => UseTheDevice.as(actor).element(this.locateAll));
    }

    matcher(): Question<Detox.NativeMatcher> {
        return Question.about(this.description, (actor) => UseTheDevice.as(actor).by(this.locateOne));
    }

    withAncestor(ancestor: Locator): Locator {
        return new Locator(
            `${this.description} with ancestor ${ancestor.description}`,
            (by) => this.locateOne(by).withAncestor(ancestor.locateOne(by)),
            (by) => this.locateAll(by).withAncestor(ancestor.locateOne(by)),
        );
    }
}

export class Locators {
    text(text: string): Locator {
        return new Locator(
            `by text ${text}`,
            (by) => by.text(`${text}`),
            (by) => by.text(`${text}`),
        );
    }

    /**
     * @desc
     *  Locates elements by their `id` attribute.
     *
     * @example <caption>Example widget</caption>
     *  <Input testID="username" />
     *
     * @example
     *  import { by, Target } from 'serenity-detox';
     *
     *  const usernameField = Target.the('username field').located(by.id('username'));
     *
     * @param {string} id
     * @returns {Locator}
     *
     * @see {@link Target}
     * @see https://webdriver.io/docs/selectors/#id
     */
    id(id: string): Locator {
        return new Locator(
            `by id ${id}`,
            (by) => by.id(`${id}`),
            (by) => by.id(`${id}`),
        );
    }
}
export const by = new Locators();
