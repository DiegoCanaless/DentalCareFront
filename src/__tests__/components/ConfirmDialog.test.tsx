import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ConfirmDialog {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<ConfirmDialog {...defaultProps} message="Custom message" />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('renders default confirm button label', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
  });

  it('renders default cancel button label', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('renders custom confirm button label', () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Yes, delete" />);
    expect(screen.getByRole('button', { name: /yes, delete/i })).toBeInTheDocument();
  });

  it('renders custom cancel button label', () => {
    render(<ConfirmDialog {...defaultProps} cancelLabel="No, keep it" />);
    expect(screen.getByRole('button', { name: /no, keep it/i })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = jest.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('renders danger variant with correct styling', () => {
    render(<ConfirmDialog {...defaultProps} variant="danger" />);
    const dangerButton = screen.getByRole('button', { name: /confirmar/i });
    expect(dangerButton).toHaveClass('bg-red-500');
  });

  it('renders warning variant with correct styling', () => {
    render(<ConfirmDialog {...defaultProps} variant="warning" />);
    const warningButton = screen.getByRole('button', { name: /confirmar/i });
    expect(warningButton).toHaveClass('bg-amber-500');
  });
});