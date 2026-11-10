import { describe, expect, vi, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from './error-state';

describe('errorState', () => {
  const handleClick = vi.fn();

  test('renders with default props', () => {
    render(<ErrorState title="Error" message="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('applies variant classes', () => {
    // ErrorState is a regular component, use typeof to access props type
    type ErrorStateProps = React.ComponentProps<typeof ErrorState>;
    const variants: ErrorStateProps['variant'][] = ['default', 'inline', 'toast'];

    variants.forEach((variant) => {
      const { unmount } = render(
        <ErrorState
          variant={variant}
          key={variant}
          title="Error"
          message="Message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      unmount();
    });
  });

  test('renders details when provided', () => {
    render(
      <ErrorState
        title="Error"
        message="Message"
        details="Technical details here"
      />
    );
    expect(screen.getByText('Ver detalles técnicos')).toBeInTheDocument();
  });

  test('renders action buttons when onRetry or onDismiss provided', () => {
    render(
      <ErrorState
        title="Error"
        message="Message"
        onRetry={handleClick}
        retryLabel="Reintentar"
        onDismiss={handleClick}
      />
    );
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /descartar/i })).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <ErrorState title="Error" message="Message" className="custom-class" />
    );
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  test('applies size classes', () => {
    type ErrorStateProps = React.ComponentProps<typeof ErrorState>;
    const sizes: ErrorStateProps['size'][] = ['sm', 'md', 'lg'];

    sizes.forEach((size) => {
      const { unmount } = render(<ErrorState title="Title" size={size} key={size} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      unmount();
    });
  });
});
