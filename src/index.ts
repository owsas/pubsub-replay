import * as Pubsub from 'pubsub-js';
import * as Microcache from 'microcache';

const cache = new Microcache();

export class PubsubReplay {
  static publish(message: string, data: any): boolean {
    cache.set(message, data);
    return Pubsub.publish(message, data);
  }

  static subscribe(message: string, func: Function, replay: boolean = false) {
    // replay previous events
    if (replay) {
      const data = cache.get(message);
      if (data) {
        func(message, data);
      }
    }

    // subscribe the client to pubsub
    return Pubsub.subscribe(message, func);
  }

  static unsubscribe(message: string) {
    Pubsub.unsubscribe(message);
  }

  static clearAllSubscriptions() {
    Pubsub.clearAllSubscriptions();
  }
}
