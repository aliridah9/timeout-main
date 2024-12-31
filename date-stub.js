/**
 * This file is used to stub the Date object to a fixed date
 * Using this file will make sure that the Date object will always return the same date when using new Date() or Date.now()
 * The default date now is set to "2024-01-01"
 */
const fakeNow = new Date("2024-01-01").valueOf();
globalThis.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      super(fakeNow);
    } else {
      super(...args);
    }
  }
};
const __DateNowOffset = fakeNow - globalThis.Date.now();
const __DateNow = globalThis.Date.now;
globalThis.Date.now = () => __DateNow() + __DateNowOffset;
