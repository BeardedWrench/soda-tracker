import { by, device, element, expect } from 'detox';

describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen by default', async () => {
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await expect(element(by.text('Sign in to continue tracking your progress'))).toBeVisible();
  });

  it('should show validation errors for empty fields', async () => {
    await element(by.text('Sign In')).tap();
    await expect(element(by.text('Please fill in all fields'))).toBeVisible();
  });

  it('should navigate to registration screen', async () => {
    await element(by.text('Sign Up')).tap();
    await expect(element(by.text('Create Account'))).toBeVisible();
    await expect(element(by.text('Sign up to start tracking your soda consumption'))).toBeVisible();
  });

  it('should validate registration form', async () => {
    await element(by.text('Sign Up')).tap();
    
    // Test empty fields
    await element(by.text('Create Account')).tap();
    await expect(element(by.text('Please fill in all fields'))).toBeVisible();

    // Test password mismatch
    await element(by.placeholder('Email')).typeText('test@example.com');
    await element(by.placeholder('Password')).typeText('password123');
    await element(by.placeholder('Confirm Password')).typeText('password456');
    await element(by.text('Create Account')).tap();
    await expect(element(by.text('Passwords do not match'))).toBeVisible();
  });

  it('should handle successful registration', async () => {
    await element(by.text('Sign Up')).tap();
    
    // Fill registration form
    await element(by.placeholder('Email')).typeText('newuser@example.com');
    await element(by.placeholder('Password')).typeText('Password123!');
    await element(by.placeholder('Confirm Password')).typeText('Password123!');
    await element(by.text('Create Account')).tap();

    // Should redirect to dashboard
    await expect(element(by.text("Today's Progress"))).toBeVisible();
  });

  it('should handle successful login', async () => {
    // Navigate back to login if needed
    if (await element(by.text('Sign In')).isVisible()) {
      await element(by.text('Sign In')).tap();
    }

    // Fill login form
    await element(by.placeholder('Email')).typeText('test@example.com');
    await element(by.placeholder('Password')).typeText('Password123!');
    await element(by.text('Sign In')).tap();

    // Should redirect to dashboard
    await expect(element(by.text("Today's Progress"))).toBeVisible();
  });

  it('should handle logout', async () => {
    // Navigate to profile tab
    await element(by.text('Profile')).tap();
    
    // Find and tap logout button
    await element(by.text('Sign Out')).tap();

    // Should redirect to login screen
    await expect(element(by.text('Welcome Back'))).toBeVisible();
  });

  it('should persist authentication state', async () => {
    // Login
    await element(by.placeholder('Email')).typeText('test@example.com');
    await element(by.placeholder('Password')).typeText('Password123!');
    await element(by.text('Sign In')).tap();

    // Reload app
    await device.reloadReactNative();

    // Should still be logged in
    await expect(element(by.text("Today's Progress"))).toBeVisible();
  });

  it('should handle invalid credentials', async () => {
    // Logout first if needed
    if (await element(by.text('Profile')).isVisible()) {
      await element(by.text('Profile')).tap();
      await element(by.text('Sign Out')).tap();
    }

    // Try invalid login
    await element(by.placeholder('Email')).typeText('wrong@example.com');
    await element(by.placeholder('Password')).typeText('wrongpassword');
    await element(by.text('Sign In')).tap();

    // Should show error message
    await expect(element(by.text('Invalid email or password'))).toBeVisible();
  });
});