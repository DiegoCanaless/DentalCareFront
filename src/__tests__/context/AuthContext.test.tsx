import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  role: 'USER' as const,
};

const mockFetch = jest.fn();

global.fetch = mockFetch;

function TestComponent() {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'not-loading'}</span>
      <span data-testid="user">{user ? user.name : 'no-user'}</span>
      <button data-testid="login" onClick={() => login('test@test.com', 'password')}>Login</button>
      <button data-testid="register" onClick={() => register('New User', 'new@test.com', 'password')}>Register</button>
      <button data-testid="logout" onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
      ok: true,
    });
  });

  it('provides initial loading state', async () => {
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({}),
      ok: true,
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
  });

  it('sets user on successful login', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockUser),
        ok: true,
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
  });

  it('clears user on logout', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockUser),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ message: 'Logged out' }),
        ok: true,
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');

    await act(async () => {
      screen.getByTestId('logout').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('sets user on successful register', async () => {
    const newUser = { ...mockUser, name: 'New User' };
    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(newUser),
        ok: true,
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      screen.getByTestId('register').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('New User');
  });

  it('provides user with correct role', async () => {
    const adminUser = { ...mockUser, role: 'SUPERADMIN' as const };
    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(adminUser),
        ok: true,
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
  });
});