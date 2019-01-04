import { validator } from '../utils/helpers'

export default class msgTrades {
  constructor(pair) {
    this.pair = new Proxy(pair, validator)
  }

  subscribe() {
    return {
      "channel": "trades",
      "event": {
        "type": "SUBSCRIBE",
        "payload": {
          "baseToken": this.pair.baseTokenAddress,
          "quoteToken": this.pair.quoteTokenAddress,
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

