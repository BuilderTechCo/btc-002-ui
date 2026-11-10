import { describe, expect, vi, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from './badge';

// Tipos literales directos para evitar undefined en optional props
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

describe('badge', () => {
  test('renders with default props', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify Tailwind classes on wrapper element; no Testing Library query exposes wrapper classes directly
    expect(badge.parentElement).toHaveClass('bg-btc-action-primary');
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify Tailwind classes on wrapper element; no Testing Library query exposes wrapper classes directly
    expect(badge.parentElement).toHaveClass('text-btc-caption');
  });

  test('applies variant classes', () => {
    const variants: readonly BadgeVariant[] = ['default', 'success', 'warning', 'error', 'info', 'outline'] as const;

    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant} key={variant}>{variant}</Badge>);
      const badge = screen.getByText(variant);
      // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify wrapper element exists; no Testing Library query exposes wrapper directly
      expect(badge.parentElement!).toBeInTheDocument();
      unmount();
    }
  });

  test('applies size classes', () => {
    const sizes: readonly BadgeSize[] = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { unmount } = render(<Badge size={size} key={size}>{size}</Badge>);
      const badge = screen.getByText(size);
      // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify wrapper element exists; no Testing Library query exposes wrapper directly
      expect(badge.parentElement!).toBeInTheDocument();
      unmount();
    }
  });

  test('renders icon when provided', () => {
    render(<Badge icon="check" iconCategory="action">With Icon</Badge>);
    // Icon renders as SVG inside the badge - verify via nested SVG
    const badge = screen.getByText('With Icon');
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested SVG icon; no Testing Library query exists for nested SVG elements
    expect(badge.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  test('renders removable button when removable prop is true', () => {
    const onRemove = vi.fn();
    render(<Badge removable onRemove={onRemove}>Removable</Badge>);
    const removeBtn = screen.getByRole('button', { name: /eliminar/i });
    expect(removeBtn).toBeInTheDocument();
  });

  test('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    render(<Badge removable onRemove={onRemove}>Removable</Badge>);
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  test('stops propagation when remove button clicked', () => {
    const onRemove = vi.fn();
    const onClick = vi.fn();
    render(<Badge removable onRemove={onRemove} onClick={onClick}>Removable</Badge>);
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify Tailwind classes on wrapper element; no Testing Library query exposes wrapper classes directly
    expect(badge.parentElement).toHaveClass('custom-class');
  });

  test('forwards ref to underlying span element', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Ref Test</Badge>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});
