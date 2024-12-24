import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/firebaseService';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Mock the firebase service
jest.mock('../../services/firebaseService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSegments: () => [''],
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, login, logout, register } = useAuth();
  return (
    <>
      <Text testID="loading-status">Loading: {loading ? 'true' : 'false'}</Text>
      <Text testID="user-status">User: {user ? user.email : 'none'}</Text>
      <Text testID="test-component">Auth Context Consumer</Text>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides authentication state to children', async () => {
    const mockUser = { email: 'test@example.com', uid: '123' } as FirebaseAuthTypes.User;
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading-status').props.children[1]).toBe('false');
      expect(getByTestId('user-status').props.children[1]).toBe('test@example.com');
    });
  });

  it('handles login successfully', async () => {
    const mockUser = { email: 'test@example.com', uid: '123' } as FirebaseAuthTypes.User;
    (authService.login as jest.Mock).mockResolvedValue({ user: mockUser });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const { login } = useAuth();
    await act(async () => {
      await login('test@example.com', 'password');
    });

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles login error', async () => {
    const mockError = new Error('Invalid credentials');
    (authService.login as jest.Mock).mockRejectedValue(mockError);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const { login } = useAuth();
    await expect(login('test@example.com', 'wrong-password')).rejects.toThrow('Invalid credentials');
  });

  it('handles registration successfully', async () => {
    const mockUser = { email: 'new@example.com', uid: '456' } as FirebaseAuthTypes.User;
    (authService.register as jest.Mock).mockResolvedValue({ user: mockUser });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const { register } = useAuth();
    await act(async () => {
      await register('new@example.com', 'password');
    });

    expect(authService.register).toHaveBeenCalledWith('new@example.com', 'password');
  });

  it('handles logout successfully', async () => {
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const { logout } = useAuth();
    await act(async () => {
      await logout();
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  it('handles auth state changes', async () => {
    const mockUser = { email: 'test@example.com', uid: '123' } as FirebaseAuthTypes.User;
    let authStateCallback: (user: FirebaseAuthTypes.User | null) => void;

    (authService.onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      authStateCallback = callback;
      return () => {};
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state
    expect(getByTestId('user-status').props.children[1]).toBe('none');

    // Simulate login
    act(() => {
      authStateCallback(mockUser);
    });

    await waitFor(() => {
      expect(getByTestId('user-status').props.children[1]).toBe('test@example.com');
    });

    // Simulate logout
    act(() => {
      authStateCallback(null);
    });

    await waitFor(() => {
      expect(getByTestId('user-status').props.children[1]).toBe('none');
    });
  });
});