/**
 * calculates average prices for bids and asks using the list of bids and asks pulled from Binance
 * @memberof module:binance
 * @param {Array.<bids>} bids - list of bids pulled from Binance
 * @param {Array.<asks>} asks - list of asks pulled from Binance
 * @returns {Array.<bid, ask>} return two numbers: average prices for bids and asks
 */
const reduce = ({bids, asks}) => {
  let [bid, ask] = [bids, asks].map( prices => prices.reduce( (sum, ele) => {
    if (sum.sum<10) {
      if (ele.quantity==undefined) ele.quantity = ele.amount
      sum.sum += ele.price*ele.quantity
      sum.qty += Number(ele.quantity)
    }
    return sum
  }, {'sum':0 ,'qty':0}))
  return {'bid': bid.sum/bid.qty, 'ask': ask.sum/ask.qty}
}

export {reduce}
