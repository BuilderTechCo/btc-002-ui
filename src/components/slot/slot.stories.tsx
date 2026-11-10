import type { Meta, StoryObj } from '@storybook/react';
import { Slot, type SlotProps } from './slot';

// Story types for polymorphic Slot component
type SlotStory = StoryObj<SlotProps<'div'>>;

const meta: Meta<SlotProps<'div'>> = {
  title: 'Components/Slot',
  component: Slot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = SlotStory;

export const Default: Story = {
  args: {
    children: 'Default slot content (renders as div)',
  },
};

export const WithCustomProps: Story = {
  args: {
    children: 'Slot with custom props',
    id: 'custom-slot',
    className: 'p-btc-4 bg-btc-muted rounded-btc-md text-center',
  },
};

export const AsSpan: Story = {
  render: () => (
    <Slot className="text-btc-brand font-medium inline">Styled as span</Slot>
  ),
};

export const AsButton: Story = {
  render: () => (
    <Slot className="px-btc-4 py-btc-2 bg-btc-brand text-white rounded-btc-md hover:opacity-90 inline-block cursor-pointer">Styled as button</Slot>
  ),
};

export const AsAnchor: Story = {
  render: () => (
    <a href="https://example.com" target="_blank" rel="noopener noreferrer">
      <Slot className="text-btc-brand underline hover:no-underline cursor-pointer">Styled as anchor</Slot>
    </a>
  ),
};

export const AsSection: Story = {
  render: () => (
    <section className="w-80">
      <Slot className="p-btc-4 bg-btc-surface border border-btc-border-default rounded-btc-lg">
        <h2 className="text-btc-heading-s font-semibold text-btc-text-primary">Section Content</h2>
        <p className="text-btc-body text-btc-text-secondary mt-btc-2">This slot renders inside a section element.</p>
      </Slot>
    </section>
  ),
};

export const ForwardRefExample: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-btc-body-s text-btc-text-muted mb-btc-2">Slot forwards ref to underlying element:</p>
      <Slot
        className="w-full px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
      />
    </div>
  ),
};

export const PolymorphicUsage: Story = {
  render: () => (
    <div className="space-y-btc-4 w-80">
      <p className="text-btc-body-s text-btc-text-muted">Styling examples using Slot as div with className:</p>
      <div className="space-y-btc-2">
        <Slot className="text-btc-heading-l font-bold text-btc-text-primary">Heading 1</Slot>
        <Slot className="text-btc-heading-m font-semibold text-btc-text-primary">Heading 2</Slot>
        <Slot className="text-btc-body text-btc-text-secondary">Paragraph text</Slot>
        <Slot className="text-btc-caption text-btc-text-muted inline">Small text</Slot>
        <Slot className="text-btc-body font-semibold text-btc-text-primary">Bold text</Slot>
        <Slot className="text-btc-body italic text-btc-text-secondary">Italic text</Slot>
      </div>
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Slot className="p-btc-6 bg-btc-surface border border-btc-border-default rounded-btc-lg space-y-btc-3">
      <Slot className="text-btc-heading-s font-semibold text-btc-text-primary">Card Title</Slot>
      <Slot className="text-btc-body text-btc-text-secondary">This card uses nested Slot components for styling.</Slot>
      <Slot className="px-btc-4 py-btc-2 bg-btc-brand text-white rounded-btc-md hover:opacity-90 self-start cursor-pointer">
        Action Button
      </Slot>
    </Slot>
  ),
};