import { Answerable, AnswersQuestions, Interaction, LogicError } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

/**
 * @desc
 *  A base class for Detox-specific interactions
 *
 * @extends {@serenity-js/core/lib/screenplay~Interaction}
 * @access private
 */
export abstract class DetoxElementInteraction extends Interaction {
    /**
     * @param {string} description
     *  A human-readable description to be used when reporting
     *  this {@link @serenity-js/core/lib/screenplay~Interaction}.
     */
    constructor(private readonly description: string) {
        super();
    }

    /**
     * @desc
     *  Returns the resolved {@link Detox.NativeElement}, or throws a {@link @serenity-js/core/lib/errors~LogicError}
     *  if the element is `undefined`.
     *
     * @param {@serenity-js/core/lib/screenplay/actor~AnswersQuestions} actor
     * @param {Answerable<Detox.NativeElement>} element
     *
     * @returns {Promise<Detox.NativeElement>}
     *
     * @protected
     */
    protected async resolve(
        actor: AnswersQuestions,
        element: Answerable<Detox.NativeElement>,
    ): Promise<Detox.NativeElement> {
        const resolved = await actor.answer(element);

        if (!resolved) {
            throw new LogicError(formatted`Couldn't find ${element}`);
        }

        return resolved;
    }

    /**
     * @desc
     *  Generates a description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Activity}.
     *
     * @returns {string}
     */
    toString(): string {
        return this.description;
    }
}
