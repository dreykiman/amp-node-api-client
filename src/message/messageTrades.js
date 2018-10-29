import { validator } from './helpers';


export class Trades {
  constructor() {
    return new Proxy(this, validator);
  }

  async subscribe() {
    return {
      "channel": "trades",
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
      "channel": "trades",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

