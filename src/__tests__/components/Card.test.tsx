import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with different padding sizes', () => {
    const { rerender, container } = render(
      <Card padding="sm">Small padding</Card>
    );
    expect(container.querySelector('div')).toHaveClass('p-5');

    rerender(<Card padding="md">Medium padding</Card>);
    expect(container.querySelector('div')).toHaveClass('p-6');

    rerender(<Card padding="lg">Large padding</Card>);
    expect(container.querySelector('div')).toHaveClass('p-7');
  });

  it('renders as button when onClick is provided', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>Clickable card</Card>
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Clickable card');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with border and shadow classes', () => {
    const { container } = render(
      <Card>Styled card</Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('border-slate-100');
    expect(card).toHaveClass('shadow-sm');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <Card className="custom-card">Custom</Card>
    );
    expect(container.querySelector('div')).toHaveClass('custom-card');
  });

  it('has transition classes', () => {
    const { container } = render(
      <Card>Animated card</Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-300');
  });
});