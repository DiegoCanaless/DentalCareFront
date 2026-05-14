import { test, expect } from '@playwright/test';

test.describe('DentalCare E2E Tests', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
  });

  test('landing page loads without critical errors', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Tratamientos').first()).toBeVisible();
    await expect(page.locator('text=Cómo Funciona').first()).toBeVisible();
    
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('401') && 
      !e.includes('500') && 
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('registration page loads', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: 'Crear Cuenta' })).toBeVisible();
    await expect(page.getByPlaceholder('Juan Pérez')).toBeVisible();
    await expect(page.getByPlaceholder('tu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••').first()).toBeVisible();
    
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('401') && 
      !e.includes('500') && 
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
    await expect(page.getByPlaceholder('tu@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••').first()).toBeVisible();
    
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('401') && 
      !e.includes('500') && 
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('login form accepts input', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder('tu@email.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').first().fill('password');
    
    await expect(page.getByPlaceholder('tu@email.com')).toHaveValue('test@example.com');
    await expect(page.getByPlaceholder('••••••••').first()).toHaveValue('password');
    
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('401') && 
      !e.includes('500') && 
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('registration form accepts input', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByPlaceholder('Juan Pérez').fill('Test User');
    await page.getByPlaceholder('tu@email.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').first().fill('password123');
    await page.getByPlaceholder('••••••••').last().fill('password123');
    
    await expect(page.getByPlaceholder('Juan Pérez')).toHaveValue('Test User');
    await expect(page.getByPlaceholder('tu@email.com')).toHaveValue('test@example.com');
    
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('401') && 
      !e.includes('500') && 
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});