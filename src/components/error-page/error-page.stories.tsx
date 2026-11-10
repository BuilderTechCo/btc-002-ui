import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage, type ErrorPageCode } from './error-page';

const meta: Meta<typeof ErrorPage> = {
  title: 'Components/ErrorPage',
  component: ErrorPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'select',
      options: [404, 500, 403, 401, 503, 'maintenance', 'offline'] as ErrorPageCode[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const NotFound: Story = {
  args: {
    code: 404,
    title: 'Page Not Found',
    message: 'The page you\'re looking for doesn\'t exist or has been moved.',
    action: {
      label: 'Go Home',
      onClick: () => console.warn('Go home'),
    },
  },
};

export const ServerError: Story = {
  args: {
    code: 500,
    title: 'Server Error',
    message: 'Something went wrong on our end. We\'re working to fix it.',
    action: {
      label: 'Retry',
      onClick: () => console.warn('Retry'),
    },
  },
};

export const Forbidden: Story = {
  args: {
    code: 403,
    title: 'Access Denied',
    message: 'You don\'t have permission to access this page.',
    action: {
      label: 'Go Back',
      onClick: () => console.warn('Go back'),
    },
  },
};

export const Unauthorized: Story = {
  args: {
    code: 401,
    title: 'Please Sign In',
    message: 'You need to be signed in to access this page.',
    action: {
      label: 'Sign In',
      onClick: () => console.warn('Sign in'),
    },
  },
};

export const Maintenance: Story = {
  args: {
    code: 503,
    title: 'Maintenance Mode',
    message: 'We\'re currently performing scheduled maintenance. Please check back soon.',
  },
};

export const WithCustomAction: Story = {
  args: {
    code: 404,
    title: 'Custom Action',
    message: 'This page has a custom action button.',
    action: {
      label: 'Contact Support',
      onClick: () => console.warn('Contact support'),
    },
  },
};

export const Minimal: Story = {
  args: {
    code: 404,
    title: 'Not Found',
    message: 'Page not found.',
    showBackButton: false,
  },
};