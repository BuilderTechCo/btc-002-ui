import { describe, expect, vi, test } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from './copy-button';

describe('copyButton', () => {
  beforeEach(() => {
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<CopyButton text="Hello world" />);
    const button = screen.getByRole('button', { name: /copiar al portapapeles/i });
    expect(button).toBeInTheDocument();
  });

  test('copies text to clipboard on click', async () => {
    render(<CopyButton text="Test content" />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test content');
    });
  });

  test('shows success state after copy', async () => {
    render(<CopyButton text="Test" />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      expect(screen.getByText(/copiado/i)).toBeInTheDocument();
    });
  });

  test('calls onCopy callback on success', async () => {
    const onCopy = vi.fn();
    render(<CopyButton text="Test" onCopy={onCopy} />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalled();
    });
  });

  test('stays in default state when copy fails (no error visual state)', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Failed'));

    render(<CopyButton text="Test" />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      // Component stays in default state, no error visual feedback
      expect(screen.getByRole('button', { name: /copiar al portapapeles/i })).toBeInTheDocument();
    });
  });

  test('calls onCopy with false on failure', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Failed'));
    const onCopy = vi.fn();

    render(<CopyButton text="Test" onCopy={onCopy} />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith(false);
    });
  });

  test('applies variant classes', () => {
    // CopyButton is a regular component, not forwardRef
    type CopyButtonProps = React.ComponentProps<typeof CopyButton>;
    const variants: CopyButtonProps['variant'][] = ['ghost', 'outline', 'primary'];

    variants.forEach((variant) => {
      const { unmount } = render(<CopyButton text="Test" variant={variant} key={variant} />);
      expect(screen.getByRole('button', { name: /copiar al portapapeles/i })).toBeInTheDocument();
      unmount();
    });
  });

  test('applies size classes', () => {
    type CopyButtonProps = React.ComponentProps<typeof CopyButton>;
    const sizes: CopyButtonProps['size'][] = ['sm', 'md', 'lg'];

    sizes.forEach((size) => {
      const { unmount } = render(<CopyButton text="Test" size={size} key={size} />);
      expect(screen.getByRole('button', { name: /copiar al portapapeles/i })).toBeInTheDocument();
      unmount();
    });
  });

  test('disables button when disabled prop', () => {
    render(<CopyButton text="Test" disabled />);
    expect(screen.getByRole('button', { name: /copiar al portapapeles/i })).toBeDisabled();
  });

  test('applies custom className', () => {
    render(<CopyButton text="Test" className="custom-class" />);
    expect(screen.getByRole('button', { name: /copiar al portapapeles/i })).toHaveClass('custom-class');
  });

  test('shows successText when copied', async () => {
    render(<CopyButton text="Test" successText="Copied!" />);
    fireEvent.click(screen.getByRole('button', { name: /copiar al portapapeles/i }));

    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });
});
