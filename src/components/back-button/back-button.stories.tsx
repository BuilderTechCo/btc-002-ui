import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from './back-button';

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    useHistoryBack: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {
    children: 'Volver',
  },
};

export const WithCustomText: Story = {
  args: {
    children: 'Regresar al inicio',
  },
};

export const Outline: Story = {
  args: {
    children: 'Volver',
    variant: 'outline',
  },
};

export const Small: Story = {
  args: {
    children: 'Volver',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Volver',
    size: 'lg',
  },
};

export const WithCustomIcon: Story = {
  args: {
    children: 'Volver',
    icon: 'arrowLeft',
  },
};

export const AsLink: Story = {
  args: {
    children: 'Volver (como enlace)',
    href: '/previous-page',
  },
};

export const WithFallback: Story = {
  args: {
    children: 'Volver con fallback',
    useHistoryBack: true,
    fallbackHref: '/home',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Volver',
    disabled: true,
  },
};