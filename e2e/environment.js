const {
  DetoxCircusEnvironment,
  SpecReporter,
  WorkerAssignReporter,
} = require('detox/runners/jest-circus');

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter,
    });
  }

  async setup() {
    await super.setup();
    // Additional setup goes here. For example:
    // 1. Clear local storage
    // 2. Set up mock location
    // 3. Set up any required test data
    // 4. Set up mock API responses
  }

  async teardown() {
    // Additional cleanup goes here
    await super.teardown();
  }

  async handleTestEvent(event, state) {
    // Handle test events. For example:
    // - Take screenshots on test failure
    // - Log additional information
    // - Clean up after each test
    if (event.name === 'test_done' && event.test.errors.length > 0) {
      // Take screenshot on failure
      try {
        await device.takeScreenshot(`${event.test.name} - failed`);
      } catch (error) {
        console.log('Failed to take screenshot:', error);
      }
    }
  }
}

module.exports = CustomDetoxEnvironment;