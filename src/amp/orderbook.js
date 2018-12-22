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

const orderbook = new Proxy({}, accessor )

const subscriptions = {}

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
