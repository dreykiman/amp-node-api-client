import { validator } from '../utils/helpers';


export class Orderbook {
  constructor() {
    return new Proxy(this, validator);
  }

  async subscribe() {
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

  async unsubscribe() {
    return {
      "channel": "orderbook",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

