# Soda Tracker App

A mobile application to help users track and reduce their soda consumption. Built with React Native, Expo, and Firebase.

## Features

- User authentication
- Track daily soda consumption
- View consumption statistics
- Set personal goals
- Monitor progress over time

## Tech Stack

- Frontend:
  - React Native with Expo
  - Firebase Authentication
  - Cloud Firestore
  - TypeScript
  - Expo Router

- Backend:
  - Firebase Cloud Functions
  - Cloud Firestore
  - TypeScript

## Development Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd soda-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Setup:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Enable Cloud Firestore
   - Copy `config/firebase.example.ts` to `config/firebase.ts` and update with your Firebase configuration

4. Start the development server:
```bash
npm start
```

## Testing

### Unit Tests

Run unit tests for both frontend and backend:

```bash
# Frontend unit tests
cd soda-tracker
npm test

# Backend unit tests
cd soda-tracker-api
npm test
```

### End-to-End Tests

Prerequisites:
- iOS: XCode and iOS Simulator
- Android: Android Studio and Android Emulator

Setup:
```bash
# Install Detox CLI globally
npm install -g detox-cli

# Install iOS dependencies (macOS only)
brew tap wix/brew
brew install applesimutils
```

Running E2E tests:

```bash
# iOS
npm run e2e:build:ios
npm run e2e:test:ios

# Android
npm run e2e:build:android
npm run e2e:test:android
```

## Continuous Integration

The project uses GitHub Actions for CI/CD:

- Frontend:
  - Unit tests
  - E2E tests (iOS and Android)
  - Build and deploy to Expo
  - Release management

- Backend:
  - Unit tests
  - Deploy to Firebase Functions

## Project Structure

```
soda-tracker/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Main app tabs
│   ├── auth/              # Authentication screens
│   └── index.tsx          # Entry point
├── config/                # Configuration files
├── contexts/              # React contexts
├── services/              # Service layer
├── e2e/                   # End-to-end tests
└── src/                   # Source code
    └── __tests__/         # Unit tests

soda-tracker-api/
├── src/                   # Backend source code
│   ├── __tests__/        # Backend tests
│   └── types.ts          # Shared types
└── firestore.rules        # Firestore security rules
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Add E2E tests for critical user flows
- Update documentation as needed
- Follow the existing code style

## Available Scripts

Frontend:
- `npm start`: Start Expo development server
- `npm test`: Run unit tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage
- `npm run e2e:test`: Run E2E tests
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator

Backend:
- `npm run build`: Build the project
- `npm run serve`: Start Firebase emulator
- `npm test`: Run unit tests
- `npm run deploy`: Deploy to Firebase

## License

This project is licensed under the MIT License - see the LICENSE file for details.
