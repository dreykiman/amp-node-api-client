/**
 * creates the list of bids and asks for specified average bid/ask prices using internal parameters described below
 * @memberof module:binance
 * @alias module:binance.makebook
 * @param {number} bid - average bid price
 * @param {number} ask - average ask price
 * @param {number} minqty - minimum order value
 * @property {number} minSpread=0.1 - minimum spread
 * @property {number} nOrders=4 - number of bids/asks per pair
 * @property {number} depth=0.2 - factor to define depth of bid/ask
 * @returns {Array.<bids,asks>} returns list of bids and asks
 */
const makebook = ({bid,ask,minqty}) => {
  let average = (bid+ask)/2

  let minSpread = 0.08

  let bidStart = Math.min( (1-minSpread/2)*average, bid )
  let askStart = Math.max( (1+minSpread/2)*average, ask )

  let nOrders = 4
  let depth = 0.1

  let [bids,asks] = [bidStart, askStart].map( (start, ind) => {
    return [...Array(nOrders).keys()].map( iord => {
      let ieff = (iord + Math.random())/nOrders

      let qty = 1 + 3*ieff*ieff
      qty *= minqty/average

      let step = ieff * depth
      step = ind===0 ? -step : step
      let price = (1 + step)*start

      return {qty, price}
    })
  })

  return {bids,asks}
}

export {makebook}
