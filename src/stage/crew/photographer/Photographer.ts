import { LogicError } from '@serenity-js/core';
import { ActivityFinished, ActivityStarts, DomainEvent, SceneStarts } from '@serenity-js/core/lib/events';
import { Stage, StageCrewMember } from '@serenity-js/core/lib/stage';

import { PhotoTakingStrategy } from './strategies';

/**
 * @desc
 *  The Photographer is a {@link @serenity-js/core/lib/stage~StageCrewMember} who takes screenshots
 *  of the device that the {@link @serenity-js/core/lib/screenplay/actor~Actor} in the spotlight is using.
 *
 * @example
 *<caption>Assigning the Photographer to the Stage</caption>
 *
 *  // Cucumber for Example
 *  // support/setup.ts
 *  import { ArtifactArchiver, configure } from '@serenity-js/core';
 *  import { Photographer, TakePhotosBeforeAndAfterInteractions } from 'serenity-detox';
 *
 *  configure({
 *      crew: [
 *          ArtifactArchiver.storingArtifactsAt('.artifacts'),
 *          Photographer.whoWill(TakePhotosBeforeAndAfterInteractions),
 *          // ... rest of the crew omitted for brevity
 *      ],
 *      // ... rest of the config omitted for brevity
 *  });
 *
 * @example
 *<caption>Taking photos upon failures only</caption>
 *
 *  import { Photographer, TakePhotosOfFailures } from 'serenity-detox';
 *
 *  Photographer.whoWill(TakePhotosOfFailures)
 *
 * @example
 *<caption>Taking photos of all the interactions</caption>
 *
 *  import { Photographer, TakePhotosOfInteractions } from 'serenity-detox';
 *
 *  Photographer.whoWill(TakePhotosOfInteractions)
 *
 * @example
 *<caption>Taking photos before and after all the interactions</caption>
 *
 *  import { Photographer, TakePhotosBeforeAndAfterInteractions } from 'serenity-detox';
 *
 *  Photographer.whoWill(TakePhotosBeforeAndAfterInteractions)
 *
 * @see {@link Stage}
 * @see {@link TakePhotosBeforeAndAfterInteractions}
 * @see {@link TakePhotosOfFailures}
 * @see {@link TakePhotosOfInteractions}
 */
export class Photographer implements StageCrewMember {
    /**
     * @desc
     *  Instantiates a new {@link Photographer} configured to take photos (screenshots)
     *  as per the specified {@link PhotoTakingStrategy}.
     *
     * @param {Function} strategy - A no-arg constructor function that instantiates a {@link PhotoTakingStrategy}.
     * @returns {StageCrewMember}
     */
    static whoWill(strategy: new () => PhotoTakingStrategy): StageCrewMember {
        return new Photographer(new strategy());
    }

    /**
     * @param {PhotoTakingStrategy} photoTakingStrategy
     * @param {Stage} stage
     */
    constructor(private readonly photoTakingStrategy: PhotoTakingStrategy, private stage?: Stage) {}

    /**
     * @desc
     *  Creates a new instance of this {@link StageCrewMember} and assigns it to a given {@link Stage}.
     *
     * @param {Stage} stage - An instance of a {@link Stage} this {@link StageCrewMember} will be assigned to
     * @returns {StageCrewMember} - A new instance of this {@link StageCrewMember}
     */
    assignedTo(stage: Stage): StageCrewMember {
        return new Photographer(this.photoTakingStrategy, stage);
    }

    /**
     * @desc
     *  Handles {@link DomainEvent} objects emitted by the {@link Stage}
     *  this {@link StageCrewMember} is assigned to.
     *
     * @param {DomainEvent} event
     * @returns {void}
     */
    notifyOf(event: DomainEvent): void {
        if (!this.stage) {
            throw new LogicError(
                `Photographer needs to be assigned to the Stage before it can be notified of any DomainEvents`,
            );
        }

        if (event instanceof SceneStarts) {
            this.photoTakingStrategy.resetStepCounter();
            return undefined;
        }

        if (!this.stage.theShowHasStarted()) {
            return undefined;
        }

        if (event instanceof ActivityStarts || event instanceof ActivityFinished) {
            this.photoTakingStrategy.considerTakingPhoto(event, this.stage);
            return undefined;
        }
    }
}
