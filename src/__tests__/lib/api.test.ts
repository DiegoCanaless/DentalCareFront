import { api } from '@/lib/api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth', () => {
    it('register calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
        ok: true,
      });
      
      await api.auth.register({ name: 'Test', email: 'test@test.com', password: 'password' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('login calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
        ok: true,
      });
      
      await api.auth.login({ email: 'test@test.com', password: 'password' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('logout calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ message: 'ok' }),
        ok: true,
      });
      
      await api.auth.logout();
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('me calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
        ok: true,
      });
      
      await api.auth.me();
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/me',
        expect.objectContaining({ credentials: 'include' })
      );
    });
  });

  describe('treatments', () => {
    it('list returns treatments', async () => {
      const treatments = [{ id: 1, name: 'Limpieza' }];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(treatments),
        ok: true,
      });
      
      const result = await api.treatments.list();
      expect(result).toEqual(treatments);
    });

    it('listAll returns all treatments', async () => {
      const treatments = [{ id: 1, name: 'Limpieza' }, { id: 2, name: 'Deleted', available: false }];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(treatments),
        ok: true,
      });
      
      const result = await api.treatments.listAll();
      expect(result).toEqual(treatments);
    });

    it('get returns single treatment', async () => {
      const treatment = { id: 1, name: 'Limpieza' };
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(treatment),
        ok: true,
      });
      
      const result = await api.treatments.get(1);
      expect(result).toEqual(treatment);
    });

    it('create sends correct data', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1 }),
        ok: true,
      });
      
      await api.treatments.create({ name: 'New', description: 'Desc', duration: 30, price: 100, icon: '🪥' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/treatments',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('delete calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
      
      await api.treatments.delete(1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/treatments/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('appointments', () => {
    it('list returns appointments', async () => {
      const appointments = [{ id: 1, date: '2024-01-01' }];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(appointments),
        ok: true,
      });
      
      const result = await api.appointments.list();
      expect(result).toEqual(appointments);
    });

    it('list with params builds query string', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue([]),
        ok: true,
      });
      
      await api.appointments.list({ date: '2024-01-01', status: 'pending' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/appointments?date=2024-01-01&status=pending',
        expect.any(Object)
      );
    });

    it('create sends correct data', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1 }),
        ok: true,
      });
      
      await api.appointments.create({ date: '2024-01-01', time: '10:00', treatmentId: 1 });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/appointments',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('availability calls correct endpoint', async () => {
      const slots = ['09:00', '10:00'];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(slots),
        ok: true,
      });
      
      const result = await api.appointments.availability(1, '2024-01-01');
      expect(result).toEqual(slots);
    });
  });

  describe('users', () => {
    it('list returns users', async () => {
      const users = [{ id: 1, name: 'Admin' }];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(users),
        ok: true,
      });
      
      const result = await api.users.list();
      expect(result).toEqual(users);
    });

    it('dentists returns dentist list', async () => {
      const dentists = [{ id: 1, name: 'Dr. Garcia' }];
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(dentists),
        ok: true,
      });
      
      const result = await api.users.dentists();
      expect(result).toEqual(dentists);
    });

    it('create user sends correct data', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ id: 1 }),
        ok: true,
      });
      
      await api.users.create({ name: 'New', email: 'new@test.com', password: 'pass', role: 'USER' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('delete calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
      
      await api.users.delete(1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('throws error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
        ok: false,
        status: 404,
      });
      
      await expect(api.treatments.get(999)).rejects.toThrow('Not found');
    });

    it('throws generic error on parse failure', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
        ok: false,
        status: 500,
      });
      
      await expect(api.treatments.list()).rejects.toThrow('Request failed');
    });
  });

  describe('options', () => {
    it('includes credentials: include', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
      
      await api.auth.me();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: 'include' })
      );
    });

    it('includes Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });
      
      await api.auth.login({ email: 'test@test.com', password: 'pass' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
    });
  });
});