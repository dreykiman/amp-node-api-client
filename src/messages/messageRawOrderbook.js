import { validator } from '../utils/helpers';


export class RawOrderbook {
  constructor() {
    return new Proxy(this, validator);
  }

  async subscribe() {
    return {
      "channel": "raw_orderbook",
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
      "channel": "raw_orderbook",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

