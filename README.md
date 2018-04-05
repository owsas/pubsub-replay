# Pubsub replay

Useful for when you need to replay the last sent event on a Pubsub network. Based on `pubsub-js`.

## Installation

`npm install pubsub-replay`

## Usage

```ts
// with es6
import { PubsubReplay } from 'pubsub-replay';

// with es5
const { PubsubReplay } = require('pubsub-replay');
```

### Publishing and Subscribing
This is done with the same API of `pubsub-js`.

```ts
PubsubReplay.subscribe('testChannel', (channelName, data) => {
  console.log(data); // { myData: true }
});

PubsubReplay.publish('testChannel', { myData: true });
```

### Subscribing to previous events
You may want to subscribe to a channel, and get the previous message that was sent before you subscribed.

For example, when an application starts, you may want to check your local database, see if there is an user connected and publish the current user in the 'user' channel.

Example
```ts
const user = await getTheCurrentLoggedInUser();
PubsubReplay.publish('user', user);
```

Later on, you may want to read if the user is logged in a 'My Account' page, and subscribe to updates in the user channel.

You would do this by doing the following:
```ts
// MyAccountPage.js
let user = await getTheCurrentLoggedInUser();
PubsubReplay.subscribe('user', (channelName, data) => {
  user = data;
});
```

The value proposition of this library in this case is not having to get the current user from a database, a network call, or local storage every time you want to get it.

Instead you would do:

```ts
// MyAccountPage.js
let user;
PubsubReplay.subscribe('user', (channelName, data) => {
  user = data;
}, true); // the true means replay the last event
```

### Motivation

I created this module because I am working with ReactJS. Quite frequently,  when I was creating modules, I had to import several libraries to make a network call or read a local database with the user in its last state.

That's when I discovered `pubsub-js`, to subscribe to the user changes across the life cycle of the application, thus avoiding to read from the database by long-polling. But, I still had to import the libraries and make the network requests to get the current user in the app.

So, I thought there should be a way in which I could subscribe to the user changes, and get the last user that was sent in the channel, without having to long poll, or to make network requests on each of the components that show the user info.


## Dev Features
* Testing with Jest
* Linting out of the box (checks the style of your code), with TSLint
* Build, prepublish and other scripts to help you to develop
* Works with Typescript: Static typing for your JS Applications, reducing amount of runtime errors
* Coverage out of the box, thanks to Jest
* Uses deterministic module resolving, with Yarn

## Credits

Developed by Juan Camilo Guarín Peñaranda,  
Otherwise SAS, Colombia  
2017

## License 

MIT.

## Support us on Patreon
[![patreon](./repo/patreon.png)](https://patreon.com/owsas)
