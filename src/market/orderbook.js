import cache from 'memory-cache'

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


if (!cache.get("orderbook")) {
  cache.put( "orderbook", new Proxy({}, accessor ))
}

let orderbook = cache.get("orderbook")

export default orderbook
