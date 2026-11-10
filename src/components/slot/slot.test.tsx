import { describe, expect, vi, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slot } from './slot';

describe('slot', () => {
  test('renders children when provided', () => {
    render(<Slot><span>Child content</span></Slot>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  test('renders nothing when children is null/undefined', () => {
    render(<Slot />);
    expect(screen.queryByText('Child content')).not.toBeInTheDocument();
  });

  test('renders nothing when children is empty', () => {
    render(<Slot>{null}</Slot>);
    expect(screen.queryByText('Child content')).not.toBeInTheDocument();
  });

  test('forwards ref to underlying div element', () => {
    const ref = vi.fn();
    render(<Slot ref={ref}><span>Content</span></Slot>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  test('applies custom className', () => {
    render(<Slot className="custom-class"><span>Content</span></Slot>);
    // The Slot applies className to the wrapper element (div by default)
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify Tailwind classes on wrapper element; no Testing Library query exposes wrapper classes directly
    expect(screen.getByText('Content').parentElement).toHaveClass('custom-class');
  });

  test('renders multiple children', () => {
    render(
      <Slot>
        <span>Child 1</span>
        <span>Child 2</span>
        <span>Child 3</span>
      </Slot>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  test('renders as different element when as prop provided', () => {
    render(<Slot as="section" aria-label="Test section"><span>Section content</span></Slot>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
    // Verify the section element is rendered by checking its role (section has implicit role="region" with aria-label)
    expect(screen.getByRole('region', { name: /test section/i })).toBeInTheDocument();
    // Note: ref type changes with `as` prop, so we don't test ref here
  });

  test('applies additional props to underlying element', () => {
    render(<Slot id="custom-id" data-test="value"><span>Content</span></Slot>);
    // The Slot applies props to the wrapper element (div by default)
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify attributes on wrapper element; no Testing Library query exposes wrapper attributes directly
    const wrapper = screen.getByText('Content').parentElement;
    expect(wrapper).toHaveAttribute('data-test', 'value');
    expect(wrapper).toHaveAttribute('id', 'custom-id');
  });
});
