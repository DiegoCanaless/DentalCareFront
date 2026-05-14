import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    const backdrop = document.querySelector('.bg-slate-900\\/40');
    if (backdrop) fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={jest.fn()} size="sm" title="Small">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={jest.fn()} size="md" title="Medium">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={jest.fn()} size="lg" title="Large">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('sets body overflow hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});