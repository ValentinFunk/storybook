// TODO: reproduce the portable-stories loader-overrun / bootstrap race as a unit test.
//
// Failure mode (observed in @storybook/angular 10.1.6 under vitest browser mode):
//
//   1. Story A's `applyLoaders` (e.g. a `loaders: [() => userEvent.hover(...)]`)
//      exceeds the vitest `testTimeout`.
//   2. Vitest rejects the test but does not cancel the in-flight async frame
//      inside `runStory` — JS has no promise cancellation and
//      `context.abortSignal` is only observed at two explicit checks:
//      between loaders → beforeEach, and after mount. There is NO check
//      between `await story.applyLoaders(context)` and `await context.mount()`.
//   3. Vitest advances to Story B. Story B's `runStory` runs the
//      module-level `cleanups` queue, which removes Story A's canvas `<div>`
//      from `document.body`.
//   4. Story A's loader eventually settles. runStory proceeds past the (now
//      stale) abort check into `applyBeforeEach` and `context.mount()`,
//      calling the renderer's bootstrap against a `targetDOMNode` that is
//      detached from the document.
//   5. Angular's `selectRootElement` does `document.querySelector(...)` on
//      the live document, finds nothing (the subtree is detached), and
//      throws NG05104.
//
// The minimum viable unit test should:
//   - Mock a renderer whose `renderToCanvas` records `document.body.contains(targetDOMNode)`
//     at call time.
//   - Compose two stories (A, B) via `composeStory`.
//   - Run A with a loader that resolves on a timer longer than an AbortController's abort.
//   - Concurrently start B so its `runStory` flushes cleanups.
//   - Assert that A's renderer was called with a detached targetDOMNode (or
//     — after the fix — was NOT called at all because of a post-loader
//     abortSignal check).
//
// See PR #<TBD> for full analysis and the Angular-specific reproduction in
// a consumer monorepo.

import { describe, it } from 'vitest';

describe('portable-stories: loader overrun vs. cleanup race', () => {
  it.todo('runStory should not call context.mount() when abortSignal fires during applyLoaders');

  it.todo('runStory should not call context.mount() when the canvasElement has been removed from document.body by a concurrent run');
});
