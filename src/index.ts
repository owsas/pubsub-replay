import * as Pubsub from 'pubsub-js';
import * as Microcache from 'microcache';

const cache = new Microcache();

export class PubsubReplay {
  /**
   * Publishes content to a topic
   * @param topic 
   * @param data 
   */
  static publish(topic: string, data: any): boolean {
    cache.set(topic, data);
    return Pubsub.publish(topic, data);
  }

  /**
   * Subscribes to a topic
   * @param topic The topic to subscribe to
   * @param func The function to execute when new events are received
   * @param replay Wether or not to call the function with a previously received event
   * @return The subscription token, that may be canceled calling `unsubscribe`
   */
  static subscribe(topic: string, func: Function, replay: boolean = false): string {
    // replay previous events
    if (replay) {
      const data = cache.get(topic);
      if (data) {
        func(topic, data);
      }
    }

    // subscribe the client to pubsub
    return Pubsub.subscribe(topic, func);
  }

  /**
   * Cancels all further notifications to the topic or clears all 
   * further notifications for the function that returned the token
   * @param tokenOrTopic The token received from `subscribe`, or the name of the topic
   */
  static unsubscribe(tokenOrTopic: string): void {
    return Pubsub.unsubscribe(tokenOrTopic);
  }

  /**
   * Clears all subscriptions calling `pubsub-js`'s clearAllSubscriptions function
   */
  static clearAllSubscriptions(): void {
    return Pubsub.clearAllSubscriptions();
  }
}
