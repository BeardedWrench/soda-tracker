import { device, element, by, expect } from 'detox';

declare global {
  namespace NodeJS {
    interface Global {
      device: typeof device;
    }
  }
}

// Initialize Detox if needed
const setup = async () => {
  await device.launchApp({
    newInstance: true,
    delete: true,
  });
};

// Common test utilities
export const loginUser = async (email: string, password: string): Promise<void> => {
  await device.reloadReactNative();
  await element(by.placeholder('Email')).typeText(email);
  await element(by.placeholder('Password')).typeText(password);
  await element(by.text('Sign In')).tap();
  await expect(element(by.text("Today's Progress"))).toBeVisible();
};

export const logoutUser = async (): Promise<void> => {
  await element(by.text('Profile')).tap();
  await element(by.text('Sign Out')).tap();
  await expect(element(by.text('Welcome Back'))).toBeVisible();
};

export const logSodaConsumption = async (size: string, brand: string): Promise<void> => {
  await element(by.text('Log Drink')).tap();
  await element(by.text('Size')).tap();
  await element(by.text(size)).tap();
  await element(by.text('Select Brand')).tap();
  await element(by.text(brand)).tap();
  await element(by.text('Log Consumption')).tap();
};

export const navigateToScreen = async (screenName: string): Promise<void> => {
  await element(by.text(screenName)).tap();
};

export const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!',
} as const;

export const COMMON_SIZES = {
  CAN: '12 fl oz (Can)',
  BOTTLE: '16.9 fl oz (Bottle)',
  LARGE: '20 fl oz (Large)',
  TWO_LITER: '2 Liter (67.6 fl oz)',
} as const;

export const BRANDS = {
  COCA_COLA: 'Coca-Cola Classic',
  DIET_COKE: 'Diet Coke',
  PEPSI: 'Pepsi',
  SPRITE: 'Sprite',
} as const;

export default setup;