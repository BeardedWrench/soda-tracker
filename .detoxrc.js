/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      build: 'expo build:ios -c',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/SodaTracker.app'
    },
    'ios.release': {
      type: 'ios.app',
      build: 'expo build:ios --release',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/SodaTracker.app'
    },
    'android.debug': {
      type: 'android.apk',
      build: 'expo build:android -c',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk'
    },
    'android.release': {
      type: 'android.apk',
      build: 'expo build:android --release',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
        os: 'iOS 16.4'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30'
      },
      headless: true
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  },
  behavior: {
    init: {
      exposeGlobals: true,
      reinstallApp: true
    },
    cleanup: {
      shutdownDevice: false
    }
  },
  artifacts: {
    rootDir: '.artifacts',
    plugins: {
      screenshot: {
        enabled: true,
        shouldTakeAutomaticSnapshots: true,
        keepOnlyFailedTestsArtifacts: true
      },
      video: {
        enabled: true,
        keepOnlyFailedTestsArtifacts: true
      },
      log: {
        enabled: true,
        keepOnlyFailedTestsArtifacts: true
      }
    }
  }
};