import { render, screen, waitFor, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('success', 'Success message')}>Show Success</button>
      <button onClick={() => showToast('error', 'Error message')}>Show Error</button>
    </div>
  );
};

describe('Toast', () => {
  it('renders ToastProvider without children', () => {
    const { container } = render(<ToastProvider />);
    expect(container).toBeInTheDocument();
  });

  it('shows success toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText('Show Success'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows error toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText('Show Error'));

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('throws error when useToast is used outside ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleError.mockRestore();
  });
});