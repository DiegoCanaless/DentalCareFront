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

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

function TestComponent() {
  const { user, loading, login, register, logout, getAuthHeader } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'not-loading'}</span>
      <span data-testid="user">{user ? user.name : 'no-user'}</span>
      <span data-testid="header">{getAuthHeader().Authorization || 'no-header'}</span>
      <button data-testid="login" onClick={() => login('test@test.com', 'password')}>Login</button>
      <button data-testid="register" onClick={() => register('New User', 'new@test.com', 'password')}>Register</button>
      <button data-testid="logout" onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.removeItem.mockImplementation(() => {});
    
    mockFetch.mockReset();
  });

  it('provides initial loading state', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({}),
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
    }, { timeout: 3000 });
  });

  it('sets user and tokens on successful login', async () => {
    const loginResponse = {
      ...mockUser,
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(loginResponse),
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 3000 });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    }, { timeout: 3000 });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-access-token');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'test-refresh-token');
  });

  it('clears user and tokens on logout', async () => {
    const loginResponse = {
      ...mockUser,
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(loginResponse),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ message: 'Logged out' }),
        ok: true,
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 3000 });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    }, { timeout: 3000 });

    await act(async () => {
      screen.getByTestId('logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    }, { timeout: 3000 });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  it('sets user and tokens on successful register', async () => {
    const registerResponse = {
      id: 2,
      name: 'New User',
      email: 'new@test.com',
      role: 'USER' as const,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    };

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(registerResponse),
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 3000 });

    await act(async () => {
      screen.getByTestId('register').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('New User');
    }, { timeout: 3000 });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
  });

  it('getAuthHeader returns correct authorization header', async () => {
    mockLocalStorage.getItem.mockReturnValue('stored-token');
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 3000 });

    expect(screen.getByTestId('header')).toHaveTextContent('Bearer stored-token');
  });

  it('provides user with correct role', async () => {
    const adminUser = {
      ...mockUser,
      role: 'SUPERADMIN' as const,
      accessToken: 'admin-token',
      refreshToken: 'admin-refresh'
    };
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(adminUser),
      ok: true,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    }, { timeout: 3000 });

    await act(async () => {
      screen.getByTestId('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    }, { timeout: 3000 });
  });
});