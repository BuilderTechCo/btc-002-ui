import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
};

export const Required: Story = {
  args: {
    children: 'Email Address',
    required: true,
  },
};

export const WithHelpText: Story = {
  args: {
    children: 'Password',
    helpText: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    children: 'Email Address',
    error: true,
    helpText: 'Please enter a valid email address',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Label',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Label',
    size: 'lg',
  },
};

export const WithHtmlFor: Story = {
  render: () => (
    <div className="w-64">
      <Label htmlFor="email-input">Email</Label>
      <input
        id="email-input"
        type="email"
        className="w-full mt-btc-1 px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
        placeholder="you@example.com"
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-72 space-y-btc-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label htmlFor="name" required>Full Name</Label>
        <input
          id="name"
          type="text"
          className="w-full mt-btc-1 px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <input
          id="email"
          type="email"
          className="w-full mt-btc-1 px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
          placeholder="john@example.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="bio" helpText="Tell us about yourself">Bio</Label>
        <textarea
          id="bio"
          className="w-full mt-btc-1 px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface min-h-[80px]"
          placeholder="Your bio..."
        />
      </div>
      <div>
        <Label htmlFor="password" error>Password</Label>
        <input
          id="password"
          type="password"
          className="w-full mt-btc-1 px-btc-3 py-btc-2 border border-btc-error rounded-btc-md text-btc-control bg-btc-surface"
          placeholder="••••••••"
        />
      </div>
    </form>
  ),
};