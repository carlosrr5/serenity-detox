import { Interaction } from '@serenity-js/core';

import { DetoxDeviceInteraction } from './DetoxDeviceInteraction';

/**
 * @desc
 *  A class for Detox-Device interactions
 */
export class Device {
    /**
     * @desc
     *  Install the app file defined in the current configuration.
     */
    static launchTheApp = (reset = false): Interaction =>
        DetoxDeviceInteraction.forDeviceTo(
            'launch the app',
            device => reset ? device.launchApp({ delete: reset }) : device.launchApp({ newInstance: true })
        );

    /**
     * @desc
     *  Install the app file defined in the current configuration.
     */
    static InstallApp = (): Interaction =>
        DetoxDeviceInteraction.forDeviceTo(
            'install the app',
            device => device.installApp()
        );
}
