import { AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';

import { UseTheDevice } from '../abilities';

type DetoxDeviceFunction = (device: Detox.Device) => Promise<void>;

/**
 * @desc
 *  A base class for Detox-Device interactions
 *
 * @extends {@serenity-js/core/lib/screenplay~Interaction}
 * @access private
 */
export class DetoxDeviceInteraction extends Interaction {
    static forDeviceTo(description: string, fn: DetoxDeviceFunction): DetoxDeviceInteraction {
        return new DetoxDeviceInteraction(description, fn);
    }

    /**
     * @param {string} description
     *  A human-readable description to be used when reporting
     *  this {@link @serenity-js/core/lib/screenplay~Interaction}.
     * @param {string} description
     * @param {DetoxDeviceFunction} fn
     *  Action to be performed by the device.
     */
    constructor(private readonly description: string, private readonly fn: DetoxDeviceFunction) {
        super();
    }

    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        return await UseTheDevice.as(actor).deviceInteraction(this.fn);
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
