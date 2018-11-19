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

export default orderbook
export { subscriptions }
