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
 * @member module:amp.orderbook
 * @type {Object.<hash, Order>}
 * dictionary of all orders on the market
 */
const orderbook = new Proxy({}, accessor )

/**
 * @member module:amp.subscriptions
 * @type {Object.<pairName, Promise>}
 * dictionary of promises to subsribe to ws stream
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
  subscriptions[pairName] = new deferred(20000)
  ws.send(JSON.stringify(msgRawOrderbook.subscribe(ord)))

  return subscriptions[pairName].promise
}

export {orderbook, subscribe, subscriptions}
