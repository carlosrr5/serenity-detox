import { Stage } from '@serenity-js/core';
import {
    ActivityFinished,
    ActivityRelatedArtifactGenerated,
    ActivityStarts,
    AsyncOperationAttempted,
    AsyncOperationCompleted,
    AsyncOperationFailed,
    DomainEvent,
} from '@serenity-js/core/lib/events';
import { CorrelationId, Description, Name, Photo } from '@serenity-js/core/lib/model';

import { UseTheDevice } from '../../../../screenplay';

/**
 * @desc
 *  Configures the {@link Photographer} to take photos (a.k.a. screenshots)
 *  of the {@link @serenity-js/core/lib/screenplay~Activity} performed
 *  by the {@link @serenity-js/core/lib/screenplay/actor~Actor} in the spotlight
 *  under specific conditions.
 *
 * @abstract
 */
export abstract class PhotoTakingStrategy {
    private stepNumber = 0;
    /**
     * @desc
     *  Takes a photo of the device held by the {@link @serenity-js/core/lib/screenplay/actor~Actor} in the spotlight.
     *
     * @param {@serenity-js/core/lib/events~ActivityStarts | @serenity-js/core/lib/events~ActivityFinished} event
     * @param {@serenity-js/core/lib/stage~Stage} stage - the Stage that holds reference to the Actor in the spotlight
     * @param {@serenity-js/core/lib/model~ScenarioDetails} scenarioDetails - holds reference to the current scene (a.k.a. Test Case)
     * @returns {void}
     *
     * @see {@link @serenity-js/core/lib/stage~Stage#theActorInTheSpotlight}
     */
    considerTakingPhoto(event: ActivityStarts | ActivityFinished, stage: Stage): void {
        if (this.shouldTakeAPhotoOf(event)) {
            let useTheDevice: UseTheDevice;

            try {
                useTheDevice = UseTheDevice.as(stage.theActorInTheSpotlight());
            } catch {
                return undefined;
            }

            const prefix = ('00' + (++this.stepNumber)).slice(-3);

            const id = CorrelationId.create(),
                nameSuffix = [prefix, this.photoNameFor(event)].join('-');

            stage.announce(
                new AsyncOperationAttempted(
                    new Description(`[Photographer:${this.constructor.name}] Taking screenshot of '${nameSuffix}'...`),
                    id,
                ),
            );

            useTheDevice
                .takeScreenshot(nameSuffix)
                .then((screenshot) => {
                    const photoName = this.combinedNameFrom(nameSuffix);

                    stage.announce(
                        new ActivityRelatedArtifactGenerated(
                            event.sceneId,
                            event.activityId,
                            photoName,
                            Photo.fromBase64(screenshot),
                        ),
                    );

                    stage.announce(
                        new AsyncOperationCompleted(
                            new Description(`[${this.constructor.name}] Took screenshot of '${nameSuffix}'`),
                            id,
                        ),
                    );
                    return;
                })
                .catch((error) => {
                    if (this.shouldIgnore(error)) {
                        stage.announce(
                            new AsyncOperationCompleted(
                                new Description(
                                    `[${this.constructor.name}] Aborted taking screenshot of '${nameSuffix}' because of ${error.constructor?.name}`,
                                ),
                                id,
                            ),
                        );
                    } else {
                        stage.announce(new AsyncOperationFailed(error, id));
                    }
                });
        }
    }

    protected abstract shouldTakeAPhotoOf(event: DomainEvent): boolean;

    protected abstract photoNameFor(event: DomainEvent): string;

    private combinedNameFrom(...parts: string[]): Name {
        return new Name(parts.filter((v) => !!v).join('-'));
    }

    // eslint-disable-next-line handle-callback-err,@typescript-eslint/no-unused-vars
    private shouldIgnore(error: Error) {
    // todo
    // return error instanceof Detox.{Exception}
    //     || error instanceof Detox.{Exception}
        return true;
    }

    resetStepCounter(): void {
        this.stepNumber = 0;
    }
}
