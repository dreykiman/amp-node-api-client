
export const round = (n, decimals = '2') => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const validator = {
  get: function(target, name) {
    if (target[name] == null) {
        console.log("======== "+name+' is not in '+target)
        throw {err: `${name} is not defined`}
    }

/* else if (typeof target[name] === 'object') {
        if (target[name]._proxy === undefined) {
          target[name]._proxy = new Proxy(target[name], validator)
        }
        return target[name]._proxy
    }
*/

    return target[name]
  }
}

export const getPricePoints = (price, quoteTokenDecimals) => {
  let precisionMultiplier = utils.bigNumberify(10).pow(9)
  let quoteMultiplier = utils.bigNumberify(10).pow(quoteTokenDecimals)
  let priceMultiplier = utils.bigNumberify(10).pow(18)

  let pricePoints = price * precisionMultiplier
  pricePoints = utils.bigNumberify(pricePoints.toFixed(0))
  pricePoints = pricePoints.mul(priceMultiplier).mul(quoteMultiplier).div(precisionMultiplier)

  return pricePoints
}

