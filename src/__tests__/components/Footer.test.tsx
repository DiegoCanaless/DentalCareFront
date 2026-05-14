import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/sections/Footer';

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock('lucide-react', () => ({
  Heart: () => <div data-testid="Heart" />,
  Phone: () => <div data-testid="Phone" />,
  Mail: () => <div data-testid="Mail" />,
  MapPin: () => <div data-testid="MapPin" />,
  Clock: () => <div data-testid="Clock" />,
  Camera: () => <div data-testid="Camera" />,
  Flag: () => <div data-testid="Flag" />,
  Bird: () => <div data-testid="Bird" />,
}));

describe('Footer', () => {
  it('renders brand name and logo', () => {
    render(<Footer />);
    expect(screen.getByText('DentalCare')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Footer />);
    expect(screen.getByText(/Tu clínica dental de confianza/)).toBeInTheDocument();
  });

  it('renders treatments section', () => {
    render(<Footer />);
    expect(screen.getByText('Tratamientos')).toBeInTheDocument();
    expect(screen.getByText('Limpieza Dental')).toBeInTheDocument();
    expect(screen.getByText('Blanqueamiento')).toBeInTheDocument();
    expect(screen.getByText('Ortodoncia')).toBeInTheDocument();
    expect(screen.getByText('Revisión General')).toBeInTheDocument();
  });

  it('renders contact section', () => {
    render(<Footer />);
    const contactoHeaders = screen.getAllByText('Contacto');
    expect(contactoHeaders.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('+54 11 5555-1234')).toBeInTheDocument();
    expect(screen.getByText('info@dentalcare.com')).toBeInTheDocument();
    expect(screen.getByText('Av. Libertador 5000, Buenos Aires')).toBeInTheDocument();
  });

  it('renders schedule section', () => {
    render(<Footer />);
    expect(screen.getByText('Horario')).toBeInTheDocument();
    expect(screen.getByText('Lun - Vie: 9:00 - 18:00')).toBeInTheDocument();
    expect(screen.getByText('Sáb: 9:00 - 14:00')).toBeInTheDocument();
    expect(screen.getByText('Dom: Cerrado')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    const instagram = screen.getByLabelText('Instagram');
    const facebook = screen.getByLabelText('Facebook');
    const twitter = screen.getByLabelText('Twitter');
    expect(instagram).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Términos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/2024 DentalCare/)).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('contains correct number of treatment items', () => {
    render(<Footer />);
    const treatments = screen.getByText('Tratamientos').parentElement?.querySelectorAll('li');
    expect(treatments?.length).toBe(4);
  });
});