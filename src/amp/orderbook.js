import deferred from '../utils/deferred'
import ws from '../connection/wsclient'
import msgRawOrderbook from '../messages/messageRawOrderbook'

const accessor = {
  get: function(target, name) {
    // Proxy converts undefined/null keys to strings
    if (name === "undefined" || name === "null") {
      console.log("invalid orderbook key: null or undefined")
      throw {err: "invalid orderbook key: null or undefined"}
    }

    if (!(name in target) ){
      target[name] = {}
    }
    return target[name]
  }
}

/**
 * dictionary of all orders on the market
 * @member module:amp.orderbook
 * @type {Object.<hash, Order>}
 */
const orderbook = new Proxy({}, accessor )

/**
 * dictionary of promises to subsribe to ws stream
 * @member module:amp.subscriptions
 * @type {Object.<pairName, Promise>}
 */
const subscriptions = {}

/**
 * sends subscription message for specified pair to AMP ws server
 * @memberof module:amp
 * @param {Pair} pair - pair structure
 * @returns {Promise} returns promise to subscribe
 */
const subscribe = (pair) => {
  let ord = {
    baseToken: pair.baseTokenAddress,
    quoteToken: pair.quoteTokenAddress
  }

  let {pairName} = pair
  subscriptions[pairName] = new deferred(30000)
  ws.send(JSON.stringify(msgRawOrderbook.subscribe(ord)))

  return subscriptions[pairName].promise
}

export {orderbook, subscribe, subscriptions}
