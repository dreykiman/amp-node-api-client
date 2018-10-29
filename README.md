# amp-node-api-client
Very Preliminary Under Heavy Development SDK for using AMP API in node.js
This library creates the messages for AMP exchange websocket API.

Clone repo, build the module:

```javascript
npm run build
```

In your code use this module, e.g. to get the list of trades per specific pair:

```javascript
import { ampMessages } from 'pathto/amp-node-api-client'

var ws = new WebSocket("ws://13.125.100.61:8081/socket");

let trades = new ampMessages.Trades();
trades.baseToken = "0x9fF229BcC9e64e36a9b396b90Fb1660888136CA6"
trades.quoteToken = "0x8c8c812ea7bb3c32B45645f7cbf84c7F902049d6"
trades.baseTokenSymbol = "AE"
trades.quoteTokenSymbol = "DAI"

ws.onopen = (ev) => {
  trades.subscribe().then( trd => ws.send( JSON.stringify( trd ) ) );
}

ws.onmessage = (ev) => {
  console.log(ev.data);
}

```

For
