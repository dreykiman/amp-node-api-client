import { validator } from '../utils/helpers';


export default class msgOrderbook {
  constructor(ord) {
    this.ord = new Proxy(Object.assign({}, ord), validator)
  }

  async subscribe() {
    return {
      "channel": "orderbook",
      "event": {
        "type": "SUBSCRIBE",
        "payload": {
          "baseToken": this.ord.baseToken,
          "quoteToken": this.ord.quoteToken,
          "name": this.ord.baseTokenSymbol+"/"+this.ord.quoteTokenSymbol,
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

