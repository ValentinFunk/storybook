// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { composeStories, composeStory, setProjectAnnotations } from '../../portable-stories';
import * as stories from './Button.stories';

// @ts-expect-error Angular global required by AbstractRenderer
globalThis.STORYBOOK_ANGULAR_OPTIONS = { experimentalZoneless: false };

setProjectAnnotations([]);

const { CSF3Primary, LoaderStory } = composeStories(stories);

describe('renders', () => {
  it('renders primary button via run', async () => {
    await CSF3Primary.run();
    const button = document.body.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.textContent).toContain('foo');
  });

  it('reuses args from composed story', () => {
    expect(CSF3Primary.args.label).toBe('foo');
    expect(CSF3Primary.args.primary).toBe(true);
  });

  it('should call and compose loaders data', async () => {
    await LoaderStory.run();
    const spyData = document.body.querySelector('[data-testid="spy-data"]');
    expect(spyData?.textContent).toEqual('mockFn return value');
    const loadedData = document.body.querySelector('[data-testid="loaded-data"]');
    expect(loadedData?.textContent).toEqual('loaded data');
  });
});

describe('CSF3', () => {
  it('renders with play function', async () => {
    const CSF3InputFieldFilled = composeStory(stories.CSF3InputFieldFilled, stories.default);
    await CSF3InputFieldFilled.run();

    const input = document.body.querySelector('[data-testid="input"]') as HTMLInputElement;
    expect(input.value).toEqual('Hello world!');
  });
});

// Batch test: all stories render via run()
const testCases = Object.values(composeStories(stories)).map((Story) => [Story.storyName, Story]);
it.each(testCases)('Renders %s story', async (_storyName, Story) => {
  if (typeof Story === 'string') {
    return;
  }
  await Story.run();
});
