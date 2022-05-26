import { actorCalled, serenity } from '@serenity-js/core';
import * as DetoxInstance from 'detox';
const { afterEach, beforeEach, cleanup, init } = DetoxInstance;

interface TestSummary {
    /**
     * Name of the current test, e.g., for:
     * describe('that screen', () =>
     *   it('should have a menu', () =>
     * The expected string would be: "should have a menu".
     */
    title: string;
    /**
     * Full name of the current test, usually preceded by a suite name, e.g.:
     * describe('that screen', () =>
     *   it('should have a menu', () =>
     * The expected string would be: "that screen should have a menu".
     */
    fullName: string;
    /**
     * Status of the current test. Free-form strings are not allowed.
     */
    status: 'running' | 'passed' | 'failed';
    /**
     * Clarifies the reason for why the test has failed.
     * Expected to coincide only with status: 'failed'.
     */
    timedOut?: boolean;
    /**
     * If the test runner is capable of retrying failed tests, then
     * this property indicates for which time this test is running.
     * When the property is undefined, its value is considered to be 1.
     * */
    invocations?: number;
}

export class DetoxAdapter {

    /**
     * @desc
     *  The cleanup phase should happen after all the tests have finished.
     *  This is the phase where the Detox server shuts down.
     *
     * @example
     *  // Cucumber for Example
     *  // support/init.ts
     *  import { AfterAll } from '@cucumber/cucumber';
     *  import { DetoxAdapter } from 'serenity-detox';
     *
     *  AfterAll(async () => {
     *    await DetoxAdapter.cleanup();
     *  });
     *
     * @returns {Promise<void>}
     */
    static cleanup = cleanup;

    /**
     * @desc
     *  The setup phase happens inside UseTheDevice.init(). This is the
     *  phase where detox reads its configuration, starts a server,
     *  loads its expection library and starts a simulator.
     *
     * @example
     *  // Cucumber for Example
     *  // support/init.ts
     *  import { BeforeAll } from '@cucumber/cucumber';
     *  import { DetoxAdapter } from 'serenity-detox';
     *
     *  BeforeAll(async () => {
     *    await DetoxAdapter.init();
     *  });
     *
     * @param {Partial<Detox.DetoxConfig>} [configOverride]
     *  this object is deep-merged with the selected Detox configuration
     *  from .detoxrc
     *
     * @returns {Promise<void>}
     *
     * @see {@link Detox.DetoxConfig}
     */
    static async init(configOverride?: Partial<Detox.DetoxConfig>): Promise<void> {
        actorCalled('detox');
        const ConfigOverride =
            configOverride ??
            { behavior: {
                init: { exposeGlobals: false },
            } };
        return await init(ConfigOverride, { reuse: false });
    }

    static beforeEach = (context: TestSummary): Promise<void> => beforeEach(context);

    static afterEach = async (context: TestSummary): Promise<void> => {
        await serenity.waitForNextCue();
        await afterEach(context);
    }
}

export default DetoxInstance;
