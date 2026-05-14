import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders badge with children', () => {
    render(<Badge>Content</Badge>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'success', 'warning', 'error', 'pending', 'info'] as const;

    variants.forEach((variant) => {
      const { container } = render(
        <Badge variant={variant}>Test {variant}</Badge>
      );
      expect(container.firstChild).toHaveClass(/bg-|text-/);
    });
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders success variant with correct styling', () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('bg-emerald-50/80');
    expect(badge).toHaveClass('text-emerald-700');
  });

  it('renders error variant with correct styling', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-red-50/80');
    expect(badge).toHaveClass('text-red-700');
  });

  it('renders pending variant with correct styling', () => {
    render(<Badge variant="pending">Pending</Badge>);
    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('bg-cyan-50/80');
    expect(badge).toHaveClass('text-cyan-700');
  });
});