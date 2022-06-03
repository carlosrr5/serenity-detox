import { Stage, StageCrewMember } from '@serenity-js/core';
import {
    ActivityRelatedArtifactArchived,
    ActivityRelatedArtifactGenerated,
    ArtifactArchived,
    ArtifactGenerated,
    AsyncOperationAttempted,
    AsyncOperationCompleted,
    AsyncOperationFailed,
    DomainEvent,
    SceneStarts,
} from '@serenity-js/core/lib/events';
import { FileSystem, Path } from '@serenity-js/core/lib/io';
import { Artifact, ArtifactType, CorrelationId, Description, Name, Photo, ScenarioDetails, TestReport } from '@serenity-js/core/lib/model';
import { Hash } from '@serenity-js/core/lib/stage/crew/artifact-archiver/Hash';
import { WriteFileOptions } from 'fs';
import { ensure, isGreaterThan, property } from 'tiny-types';

/**
 * @desc
 *  Stores any {@link Artifact}s emitted via {@link ArtifactGenerated} events on the {@link FileSystem}
 *
 * @example <caption>Registering ArtifactArchiver programmatically</caption>
 *  import { configure, StreamReporter } from '@serenity-js/core';
 *
 *  configure({
 *      crew: [
 *          ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
 *      ],
 *  });
 *
 * @example <caption>Registering ArtifactArchiver using Protractor configuration</caption>
 *  // protractor.conf.js
 *  const { ArtifactArchiver } = require('@serenity-js/core');
 *
 *  exports.config = {
 *    framework:     'custom',
 *    frameworkPath: require.resolve('@serenity-js/protractor/adapter'),
 *
 *    serenity: {
 *      crew: [
 *        ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
 *      ],
 *      // other Serenity/JS config
 *    },
 *
 *    // other Protractor config
 *  };
 *
 * @public
 * @implements {StageCrewMember}
 */
export class ArtifactArchiver implements StageCrewMember {
    private scenarioDetails: ScenarioDetails;

    /**
     * @desc
     *  Instantiates an `ArtifactArchiver` storing artifacts in a given `destination`.
     *  The `destination` directory will be created automatically and recursively if it doesn't exist.
     *
     * @param {string[]} destination
     *
     * @returns {StageCrewMember}
     */
    static storingArtifactsAt(...destination: string[]): StageCrewMember {
        ensure('Path to destination directory', destination, property('length', isGreaterThan(0)));

        const pathToDestination = [...destination, 'storybook'].map(segment => new Path(segment)).reduce((acc, current) => acc.join(current));

        return new ArtifactArchiver(new FileSystem(pathToDestination));
    }

    /**
     * @param {FileSystem} fileSystem
     * @param {Stage} [stage]
     *  The stage this {@link StageCrewMember} should be assigned to
     */
    constructor(
        private readonly fileSystem: FileSystem,
        private readonly stage?: Stage,
    ) {
    }

    /**
     * @desc
     *  Creates a new instance of this {@link StageCrewMember} and assigns it to a given {@link Stage}.
     *
     * @see {@link StageCrewMember}
     *
     * @param {Stage} stage - An instance of a {@link Stage} this {@link StageCrewMember} will be assigned to
     * @returns {StageCrewMember} - A new instance of this {@link StageCrewMember}
     */
    assignedTo(stage: Stage): StageCrewMember {
        return new ArtifactArchiver(this.fileSystem, stage);
    }

    /**
     * @desc
     *  Handles {@link DomainEvent} objects emitted by the {@link StageManager}.
     *
     * @see {@link StageCrewMember}
     *
     * @listens {ArtifactGenerated}
     * @emits {ArtifactArchived}
     *
     * @param {DomainEvent} event
     * @returns {void}
     */
    notifyOf(event: DomainEvent): void {

        if(event instanceof SceneStarts) {
            this.scenarioDetails = event.details;
        }

        if (!(event instanceof ArtifactGenerated)) {
            // ignore any other events
            return void 0;
        }

        if (event.artifact instanceof Photo) {
            const filename = this.fileNameFor('photo', event.name, event.artifact, 'png');
            const relativePath = this.scenarioDetails ? Path.from(
                this.scenarioDetails.location.path.directory().value,
                this.scenarioDetails.location.path.basename().replace('.feature', ''),
                this.scenarioDetails.name.value,
            ).join(filename) : filename;

            this.archive(
                relativePath,
                event.artifact.base64EncodedValue,
                'base64',
                this.archivisationAnnouncement(event, relativePath),
            );
        }

        if (event.artifact instanceof TestReport) {
            const filename = this.fileNameFor('scenario', event.name, event.artifact, 'json');

            this.archive(
                filename,
                event.artifact.map(JSON.stringify),
                'utf8',
                this.archivisationAnnouncement(event, filename),
            );
        }
    }

    private fileNameFor(prefix: string, artifactName: Name, artifact: Artifact, extension: string): Path {
        const hash = Hash.of(artifact.base64EncodedValue).short();

        return Path.fromSanitisedString(
            // Ensure that the file name is shorter than 250 chars, which is safe with all the filesystems
            // note: we can't do that in the Path constructor as the Path can be used to join other paths,
            // so restricting the length of the _path_ itself would not be correct.
            `${ prefix.slice(0, 10) }-${ urlFriendly(artifactName.value).slice(0, 64) }-${ hash }.${ extension }`.replace(/-+/g, '-'),
            // characters:     10    1         64                                      1    10   1    4                                 < 100
        );
    }

    private archive(relativePath: Path, contents: string, encoding: WriteFileOptions, announce: (absolutePath: Path) => void): void {
        const id = CorrelationId.create();

        this.stage?.announce(new AsyncOperationAttempted(
            new Description(`[${ this.constructor.name }] Saving '${ relativePath.value }'...`),
            id,
        ));

        this.fileSystem.store(relativePath, contents, encoding)
            .then(absolutePath => {
                announce(relativePath);

                this.stage?.announce(new AsyncOperationCompleted(
                    new Description(`[${ this.constructor.name }] Saved '${ absolutePath.value }'`),
                    id,
                ));
            })
            .catch(error => {
                this.stage?.announce(new AsyncOperationFailed(error, id));
            });
    }

    private archivisationAnnouncement(event: ArtifactGenerated | ActivityRelatedArtifactGenerated, relativePathToArtifact: Path) {
        return (absolutePath: Path) => {
            if (event instanceof ActivityRelatedArtifactGenerated) {
                this.stage?.announce(new ActivityRelatedArtifactArchived(
                    event.sceneId,
                    event.activityId,
                    event.name,
                    event.artifact.constructor as ArtifactType,
                    relativePathToArtifact,
                ));
            } else if (event instanceof ArtifactGenerated) {
                this.stage?.announce(new ArtifactArchived(
                    event.sceneId,
                    event.name,
                    event.artifact.constructor as ArtifactType,
                    relativePathToArtifact,
                ));
            }
        };
    }
}

/**
 * @private
 * @param {string} name
 */
function urlFriendly(name: string): string {
    return name.toLocaleLowerCase()
        .replace(/[^\d.a-z-]/g, '-');
}
