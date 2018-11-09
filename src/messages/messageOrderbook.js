import { validator } from '../utils/helpers'


export default {
  subscribe: ord => {
    ord = new Proxy(Object.assign({}, ord), validator)

    return {
      "channel": "orderbook",
      "event": {
        "type": "SUBSCRIBE",
        "payload": {
          "baseToken": ord.baseToken,
          "quoteToken": ord.quoteToken,
        }
      }
    }
  },

  unsubscribe: _ => {
    return {
      "channel": "orderbook",
      "event": {
        "type": "UNSUBSCRIBE",
      }
    }
  }
}

