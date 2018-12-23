export const reduce = ({bids, asks}) => {
  let [bid, ask] = [bids, asks].map( prices => prices.reduce( (sum, ele) => {
    if (sum.sum<10) {
      sum.sum += ele.price*ele.quantity
      sum.qty += Number(ele.quantity)
    }
    return sum
  }, {'sum':0 ,'qty':0}))
  return {'bid': bid.sum/bid.qty, 'ask': ask.sum/ask.qty}
}

