import { Ability, Duration, UsesAbilities } from '@serenity-js/core';
import { readFileSync } from 'fs';

import DetoxInstance from '../../adapter/DetoxAdapter';

/**
 * @desc
 *  An {@link @serenity-js/core/lib/screenplay~Ability} that enables the {@link @serenity-js/core/lib/screenplay/actor~Actor}
 *  to interact with Mobile Devices using [Detox](https://wix.github.io/Detox/).
 *
 * @experimental
 *  *Please note*: this class is still marked as experimental while new Detox Interactions and Questions are being developed.
 *  This means that its interface can change without affecting the major version of Serenity/JS itself.
 *  In particular, please don't rely on the `detox` field to remain `public` in future releases.
 *
 * @example <caption>Using the Detox instance</caption>
 *  import { actorCalled, Cast } from '@serenity-js/core';
 *  import { Device, UseTheDevice, by, Target } from 'serenity-detox';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *
 *  const actor = actorCalled('Wendy').whoCan(UseTheDevice.now());
 *
 *  const MainScreen = {
 *      Title: Target.the('title').located(by.id('labelTitle')),
 *  };
 *
 *  actor.attemptsTo(
 *      Device.launchApp(),
 *      Ensure.that(Text.of(MainScreen.Title), equals('Detox Example')),
 *  );
 *
 * @see https://wix.github.io/Detox/
 *
 * @public
 * @implements {@serenity-js/core/lib/screenplay~Ability}
 * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
 */
export class UseTheDevice implements Ability {
    by(locator: (by: Detox.ByFacade) => Detox.NativeMatcher): Detox.NativeMatcher {
        return locator(DetoxInstance.by);
    }
    /**
     * @desc
     *  Detox Instance that enables to interact with Mobile Devices using [Detox](https://wix.github.io/Detox/).
     * @experimental
     *  *Please note*: this class is still marked as experimental while new Detox Interactions and Questions are being developed.
     *  This means that its interface can change without affecting the major version of Serenity/JS itself.
     *  In particular, please don't rely on the `detox` field to remain `public` in future releases.
     *
     * @public
     */
    //public static readonly detox = DetoxInstance;

    /**
     * @private
     * @static
     */
    private static instance: UseTheDevice;

    element(locator: (by: Detox.ByFacade) => Detox.NativeMatcher): Detox.IndexableNativeElement {
        return DetoxInstance.element(locator(DetoxInstance.by));
    }
    /**
     * @static
     */
    static expect = DetoxInstance.expect;
    static by = DetoxInstance.by;

    /**
     * @desc
     *  Used to access the Actor's ability to {@link UseTheDevice}
     *  from within the {@link @serenity-js/core/lib/screenplay~Interaction} classes,
     *  such as {@link Navigate}.
     *
     * @param {@serenity-js/core/lib/screenplay/actor~UsesAbilities} actor
     * @returns {UseTheDevice}
     */
    static as(actor: UsesAbilities): UseTheDevice {
        return actor.abilityTo(UseTheDevice);
    }

    /**
     * @desc
     *  Instanciates the {@link Ability} that enables the {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  to interact with Mobile Devices using [Detox](https://wix.github.io/Detox/).
     *
     * @example <caption>Assigning the same Ability to all Cast members</caption>
     * // Cucumber for Example
     * // support/setup.ts
     * import { Cast, configure } from '@serenity-js/core';
     * import { UseTheDevice } from 'serenity-detox';
     *
     * configure({
     *     actors: Cast.whereEveryoneCan(UseTheDevice.now()),
     *     // ... rest of the config omitted for brevity
     * });
     *
     * @see {@link @serenity-js/core~configure}
     * @see {@link @serenity-js/core~Cast}
     *
     * @returns {UseTheDevice}
     */
    static now(): UseTheDevice {
        return new UseTheDevice();
    }

    /**
     * @desc
     *  Instanciates the {@link Ability} that enables the {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  to interact with Mobile Devices using [Detox](https://wix.github.io/Detox/).
     *
     * @example <caption>Assigning the same Ability to all Cast members</caption>
     * // Cucumber for Example
     * // support/setup.ts
     * import { Cast, configure } from '@serenity-js/core';
     * import { UseTheDevice } from 'serenity-detox';
     *
     * configure({
     *     actors: Cast.whereEveryoneCan(new UseTheDevice()),
     *     // ... rest of the config omitted for brevity
     * });
     *
     * @see {@link @serenity-js/core~configure}
     * @see {@link @serenity-js/core~Cast}
     */
    constructor() {
        if (!UseTheDevice.instance) {
            UseTheDevice.instance = this;
        }
        return UseTheDevice.instance;
    }

    async deviceInteraction(fn: (device: Detox.Device) => Promise<void>): Promise<void> {
        return await fn(DetoxInstance.device);
    }

    /**
     * @desc
     *  Pauses the activities for the given duration.
     *
     * @param {Duration} duration
     * @returns {Promise<void>}
     */
    pause(duration: Duration): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, duration.inMilliseconds()));
    }

    /**
     * @desc
     *  Take a screenshot of the device.
     *
     * @param {string} name - for the screenshot artifact
     * @returns {Promise<string>}
     *  A promise that will resolve to a base64-encoded screenshot PNG
     */
    async takeScreenshot(name: string): Promise<string> {
        const tempLocation = await DetoxInstance.device.takeScreenshot(name);
        const bitmap = readFileSync(tempLocation, { encoding: 'base64' });
        return bitmap;
    }
}
