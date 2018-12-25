/**
 * creates the list of bids and asks for specified average bid/ask prices using internal parameters described below
 * @memberof module:binance
 * @alias module:binance.makebook
 * @param {number} bid - average bid price
 * @param {number} ask - average ask price
 * @property {number} minSpread=0.1 - minimum spread
 * @property {number} minQuantityInQuote=0.02|3 - minimum order value is 0.02 ETH or 3 USD
 * @property {number} nOrders=4 - number of bids/asks per pair
 * @property {number} depth=0.2 - factor to define depth of bid/ask
 * @returns {Array.<bids,asks>} returns list of bids and asks
 */
const makebook = ({bid,ask}) => {
  let average = (bid+ask)/2

  let minSpread = 0.1

  let bidStart = Math.min( (1-minSpread/2)*average, bid )
  let askStart = Math.max( (1+minSpread/2)*average, ask )

  let minQuantityInQuote = 0.02
  if(average>100) minQuantityInQuote = 3
  let nOrders = 4
  let depth = 0.2

  let [bids,asks] = [bidStart, askStart].map( (start, ind) => {
    return [...Array(nOrders).keys()].map( iord => {
      let ieff = (iord + Math.random())/nOrders

      let qty = 1 + 3*ieff*ieff
      qty *= minQuantityInQuote/average

      let step = ieff * depth
      step = ind===0 ? -step : step
      let price = (1 + step)*start

      return {qty, price}
    })
  })

  return {bids,asks}
}

export {makebook}
