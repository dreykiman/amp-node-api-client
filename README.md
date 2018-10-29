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

For write permissions you'll need to sign the message using the signer of your choice:

```javascript
import { ampMessages } from 'pathto/amp-node-api-client'

var ws = new WebSocket("ws://13.125.100.61:8081/socket");

let wallet = new Wallet(privateKey, provider)

//pass your signer to the orders object
let orders = new ampMessages.Orders(wallet);

orders.amount = "1"
orders.price = "1"
orders.exchangeAddress = EXCHANGE_ADDRESS
orders.userAddress = wallet.address
orders.side = "BUY"
orders.baseTokenAddress = "0x9fF229BcC9e64e36a9b396b90Fb1660888136CA6"
orders.quoteTokenAddress = "0xe9b5da78abb9fda785f828836f5c7e7f20273779" //WETH

orders.makeFee = "0.01"
orders.takeFee = "0.01"
orders.makeFee = "0"
orders.takeFee = "0"

ws.onopen = (ev) => {
  orders.new_order().then( (order) => {
    console.log(order);
    ws.send(JSON.stringify(order));
  });
}

ws.onmessage = (ev) => {
  console.log(ev.data);
}

```
