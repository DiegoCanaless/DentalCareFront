import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: () => false,
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe('Hero', () => {
  it('renders main heading', () => {
    render(<Hero />);
    expect(screen.getByText(/Tu sonrisa/)).toBeInTheDocument();
  });

  it('renders highlighted text', () => {
    render(<Hero />);
    expect(screen.getByText(/más brillante/)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Hero />);
    expect(screen.getByText(/Atención dental de primera calidad/)).toBeInTheDocument();
  });

  it('renders reservation button', () => {
    render(<Hero />);
    expect(screen.getByText('Reservar Cita')).toBeInTheDocument();
  });

  it('renders treatments button', () => {
    render(<Hero />);
    expect(screen.getByText('Ver Tratamientos')).toBeInTheDocument();
  });

  it('renders availability badge', () => {
    render(<Hero />);
    expect(screen.getByText('Citas disponibles esta semana')).toBeInTheDocument();
  });

  it('renders statistics section', () => {
    render(<Hero />);
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
  });

  it('renders statistics labels', () => {
    render(<Hero />);
    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(screen.getByText('Años')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción')).toBeInTheDocument();
  });

  it('renders upcoming appointment card', () => {
    render(<Hero />);
    expect(screen.getByText('Próxima cita')).toBeInTheDocument();
    expect(screen.getByText('Mañana 10:00 AM')).toBeInTheDocument();
  });

  it('renders promotion card', () => {
    render(<Hero />);
    expect(screen.getByText('Blanqueamiento')).toBeInTheDocument();
    expect(screen.getByText('30% OFF')).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    render(<Hero />);
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});