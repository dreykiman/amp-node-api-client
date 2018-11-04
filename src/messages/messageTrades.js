import { validator } from '../utils/helpers';

export default class msgTrades {
  constructor() {
    return new Proxy(this, validator);
  }

  subscribe() {
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

  unsubscribe() {
    return {
      "channel": "trades",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

