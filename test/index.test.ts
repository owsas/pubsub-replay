import * as Pubsub from 'pubsub-js';
import { PubsubReplay } from '../src/index';

const data = { a: 123 };

describe('#publish', () => {
  test('should allow publishing something without errors', () => {
    PubsubReplay.publish('test', { a: 123 });
  });
});

describe('#subscribe', () => {
  test('should allow subscribing to an event', (done) => {
    PubsubReplay.subscribe('test2', (message, d) => {
      expect(d).toEqual(data);
      done();
    }, true);
    
    PubsubReplay.publish('test2', data);
  });

  test('should be able to replay previously sent event', (done) => {
    PubsubReplay.subscribe('test2', (message, d2) => {
      expect(d2).toEqual(data);
      done();
    }, true);
  });
});

describe('#unsubscribe', () => {
  test('should allow unsubscribing from events', () => {
    // this should never be called
    PubsubReplay.subscribe('test3', (message, d) => {
      expect(message).not.toBeDefined();
      expect(d).not.toBeDefined();
    }, true);

    PubsubReplay.unsubscribe('test3');

    PubsubReplay.publish('test3', { test: true });
  });
});

describe('#clearAllSubscriptions', () => {
  test('should call Pubsub #clearAllSubscriptions', () => {
    const spy = jest.spyOn(PubSub, 'clearAllSubscriptions');
    PubsubReplay.clearAllSubscriptions();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
