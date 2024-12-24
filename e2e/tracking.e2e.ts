import { by, device, element, expect } from 'detox';

describe('Soda Tracking Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });

    // Login before tests
    await element(by.placeholder('Email')).typeText('test@example.com');
    await element(by.placeholder('Password')).typeText('Password123!');
    await element(by.text('Sign In')).tap();
    await expect(element(by.text("Today's Progress"))).toBeVisible();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show dashboard with initial state', async () => {
    await expect(element(by.text("Today's Progress"))).toBeVisible();
    await expect(element(by.text('0.0 fl oz'))).toBeVisible();
  });

  it('should navigate to log screen and show drink options', async () => {
    await element(by.text('Log Drink')).tap();
    
    // Check size options
    await expect(element(by.text('Size'))).toBeVisible();
    await expect(element(by.text('12 fl oz (Can)'))).toBeVisible();
    
    // Check brand options
    await expect(element(by.text('Select Brand'))).toBeVisible();
    await expect(element(by.text('Coca-Cola'))).toBeVisible();
  });

  it('should log a soda consumption', async () => {
    await element(by.text('Log Drink')).tap();

    // Select size
    await element(by.text('Size')).tap();
    await element(by.text('12 fl oz (Can)')).tap();

    // Select brand
    await element(by.text('Select Brand')).tap();
    await element(by.text('Coca-Cola Classic')).tap();

    // Submit log
    await element(by.text('Log Consumption')).tap();

    // Verify success message
    await expect(element(by.text('Soda consumption logged successfully'))).toBeVisible();

    // Navigate back to dashboard
    await element(by.text('Dashboard')).tap();

    // Verify updated consumption
    await expect(element(by.text('12.0 fl oz'))).toBeVisible();
  });

  it('should show statistics after logging consumption', async () => {
    await element(by.text('Statistics')).tap();

    // Check weekly stats
    await expect(element(by.text('Weekly Statistics'))).toBeVisible();
    await expect(element(by.text('Weekly Total'))).toBeVisible();
    
    // Verify consumption data
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    await expect(element(by.text(today))).toBeVisible();
    await expect(element(by.text('12.0'))).toBeVisible();
  });

  it('should update daily limit in profile', async () => {
    await element(by.text('Profile')).tap();
    
    // Edit goals
    await element(by.text('Edit Goals')).tap();
    
    // Clear and set new daily limit
    const dailyLimitInput = element(by.placeholder('Enter daily limit'));
    await dailyLimitInput.clearText();
    await dailyLimitInput.typeText('24');
    
    // Save changes
    await element(by.text('Save Changes')).tap();
    
    // Verify success message
    await expect(element(by.text('Goals updated successfully'))).toBeVisible();
    
    // Navigate to dashboard to verify new limit
    await element(by.text('Dashboard')).tap();
    await expect(element(by.text('24.0 fl oz limit'))).toBeVisible();
  });

  it('should show warning when exceeding daily limit', async () => {
    await element(by.text('Log Drink')).tap();

    // Log a large consumption
    await element(by.text('Size')).tap();
    await element(by.text('2 Liter (67.6 fl oz)')).tap();
    await element(by.text('Select Brand')).tap();
    await element(by.text('Coca-Cola Classic')).tap();
    await element(by.text('Log Consumption')).tap();

    // Navigate to dashboard
    await element(by.text('Dashboard')).tap();

    // Verify warning message
    await expect(element(by.text('Daily limit exceeded'))).toBeVisible();
    await expect(element(by.text('79.6 fl oz'))).toBeVisible(); // 12 + 67.6
  });

  it('should persist consumption data after app reload', async () => {
    await device.reloadReactNative();

    // Verify data is still present
    await expect(element(by.text('79.6 fl oz'))).toBeVisible();
    
    // Check statistics
    await element(by.text('Statistics')).tap();
    await expect(element(by.text('79.6'))).toBeVisible();
  });
});