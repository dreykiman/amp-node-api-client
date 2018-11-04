import { validator } from '../utils/helpers';

export default class msgRawOrderbook {
  constructor() {
    return new Proxy(this, validator);
  }

  subscribe() {
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

  unsubscribe() {
    return {
      "channel": "raw_orderbook",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

