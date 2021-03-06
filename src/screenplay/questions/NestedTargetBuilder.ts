import { Answerable } from '@serenity-js/core';

import { TargetBuilder } from './TargetBuilder';
import { TargetElement } from './targets';

/**
 * @desc
 *  Fluent interface to make the instantiation of
 *  the {@link @serenity-js/core/lib/screenplay~Question}
 *  about a nested {@link Target} more readable.
 *
 * @see {@link Target}
 *
 * @interface
 */
export interface NestedTargetBuilder<T> {

    /**
     * @desc
     *  Instantiates a {@link @serenity-js/core/lib/screenplay~Question}
     *  about a {@link Target}.
     *
     * @param {@serenity-js/core/lib/screenplay~Answerable<Detox.NativeElement>} parent
     * @returns {TargetBuilder}
     *
     * @see {@link Target}
     * @see {@link TargetBuilder}
     */
    of: (parent: Answerable<TargetElement>) => TargetBuilder<T>;
}
