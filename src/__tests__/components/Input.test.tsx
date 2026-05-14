import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders input without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders input with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with icon on left', () => {
    const MockIcon = () => <span>Icon</span>;
    render(
      <Input icon={MockIcon} iconPosition="left" placeholder="With icon" />
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('renders with icon on right', () => {
    const MockIcon = () => <span>Icon</span>;
    render(
      <Input icon={MockIcon} iconPosition="right" placeholder="With icon" />
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(
      <Input onChange={handleChange} placeholder="Type here" />
    );
    fireEvent.change(screen.getByPlaceholderText('Type here'), {
      target: { value: 'test value' }
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when error prop is provided', () => {
    render(
      <Input error="This field is required" placeholder="Required" />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Input error="Error" placeholder="Error input" />
    );
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-error');
  });

  it('renders with custom type', () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with required attribute', () => {
    render(<Input required placeholder="Required field" />);
    const input = screen.getByPlaceholderText('Required field');
    expect(input).toHaveAttribute('required');
  });

  it('renders disabled input', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  it('renders with custom value', () => {
    render(<Input value="Test value" placeholder="Value" />);
    const input = screen.getByPlaceholderText('Value');
    expect(input).toHaveValue('Test value');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Input className="custom-input" placeholder="Custom" />
    );
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-input');
  });
});