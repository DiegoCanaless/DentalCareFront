import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/ui/Navbar';

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useReducedMotion: () => false,
}));

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('DentalCare')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Tratamientos')).toBeInTheDocument();
    expect(screen.getByText('Cómo Funciona')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
  });

  it('renders login and register buttons when no user', () => {
    render(<Navbar />);
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('shows mobile menu button', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('renders as a nav element', () => {
    render(<Navbar />);
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('renders heart icon', () => {
    render(<Navbar />);
    expect(screen.getByTestId('Heart')).toBeInTheDocument();
  });
});