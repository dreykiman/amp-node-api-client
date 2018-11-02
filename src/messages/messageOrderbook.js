import { validator } from '../utils/helpers';


export default class Orderbook {
  constructor() {
    return new Proxy(this, validator);
  }

  subscribe() {
    return {
      "channel": "orderbook",
      "event": {
        "type": "SUBSCRIBE",
        "payload": {
          "baseToken": this.baseToken,
          "quoteToken": this.quoteToken,
          "name": this.baseTokenSymbol+"/"+this.quoteTokenSymbol,
        }
      }
    }
  }

  unsubscribe() {
    return {
      "channel": "orderbook",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

