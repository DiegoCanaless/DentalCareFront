import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react with actual React components
const MockIcon = ({ className, ...props }) => {
  const componentName = Object.keys(props).find(k => k.endsWith('__')) || 'Icon';
  return <svg data-testid="mock-icon" className={className} {...props} />;
};

const createMockIcon = (name) => {
  const Icon = ({ className, ...props }) => <MockIcon data-testid={name} className={className} {...props} />;
  Icon.displayName = name;
  return Icon;
};

jest.mock('lucide-react', () => ({
  Heart: createMockIcon('Heart'),
  Calendar: createMockIcon('Calendar'),
  User: createMockIcon('User'),
  X: createMockIcon('X'),
  Check: createMockIcon('Check'),
  CheckCircle: createMockIcon('CheckCircle'),
  AlertCircle: createMockIcon('AlertCircle'),
  AlertTriangle: createMockIcon('AlertTriangle'),
  Info: createMockIcon('Info'),
  Sparkles: createMockIcon('Sparkles'),
  Star: createMockIcon('Star'),
  Shield: createMockIcon('Shield'),
  Clock: createMockIcon('Clock'),
  ChevronLeft: createMockIcon('ChevronLeft'),
  ChevronRight: createMockIcon('ChevronRight'),
  Edit2: createMockIcon('Edit2'),
  Trash2: createMockIcon('Trash2'),
  Eye: createMockIcon('Eye'),
  EyeOff: createMockIcon('EyeOff'),
  Mail: createMockIcon('Mail'),
  Lock: createMockIcon('Lock'),
  LogOut: createMockIcon('LogOut'),
  Crown: createMockIcon('Crown'),
  Stethoscope: createMockIcon('Stethoscope'),
  Users: createMockIcon('Users'),
  DollarSign: createMockIcon('DollarSign'),
  TrendingUp: createMockIcon('TrendingUp'),
  Menu: createMockIcon('Menu'),
  Plus: createMockIcon('Plus'),
  Loader2: createMockIcon('Loader2'),
  ArrowRight: createMockIcon('ArrowRight'),
  Sun: createMockIcon('Sun'),
  Braces: createMockIcon('Braces'),
  Scissors: createMockIcon('Scissors'),
  MapPin: createMockIcon('MapPin'),
  Phone: createMockIcon('Phone'),
  Flag: createMockIcon('Flag'),
  Camera: createMockIcon('Camera'),
  Loader2: createMockIcon('Loader2'),
}));

// Mock API calls
global.fetch = jest.fn();

// Mock localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});