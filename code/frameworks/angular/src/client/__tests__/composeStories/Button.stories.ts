import { expect, fn, userEvent, within } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from './Button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Example/Button',
  component: ButtonComponent,
  args: { primary: false },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const CSF3Primary: Story = {
  args: {
    label: 'foo',
    primary: true,
  },
};

export const CSF3Button: Story = {
  args: { label: 'foo' },
};

export const CSF3InputFieldFilled: Story = {
  render: () => ({
    template: '<input data-testid="input" />',
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Step label', async () => {
      const inputEl = canvas.getByTestId('input');
      await userEvent.type(inputEl, 'Hello world!');
      await expect(inputEl).toHaveValue('Hello world!');
    });
  },
};

const mockFn = fn();
export const LoaderStory: StoryObj<{ mockFn: (val: string) => string }> = {
  args: {
    mockFn,
  },
  loaders: [
    async () => {
      mockFn.mockReturnValueOnce('mockFn return value');
      return {
        value: 'loaded data',
      };
    },
  ],
  render: (args, { loaded }) => ({
    template: `
      <div>
        <div data-testid="loaded-data">${loaded.value}</div>
        <div data-testid="spy-data">${args.mockFn('render')}</div>
      </div>
    `,
  }),
  play: async () => {
    expect(mockFn).toHaveBeenCalledWith('render');
  },
};
