import {getmakerconf} from '../datastore/firedata'

/**
 * creates the list of bids and asks for specified average bid/ask prices using internal parameters described below
 * @memberof module:marketmaker
 * @alias module:marketmaker.makebook
 * @param {number} bid - average bid price
 * @param {number} ask - average ask price
 * @param {number} minqty - minimum order value
 * @property {number} nOrders=4 - number of bids/asks per pair
 * @property {number} depth=0.1 - factor to define depth of bid/ask
 * @returns {Array.<bids,asks>} returns list of bids and asks
 */
const makebook = ({bid,ask,minqty,spread}) => {
  let average = (bid+ask)/2

  let bidStart = Math.min( (1-spread/2)*average, bid )
  let askStart = Math.max( (1+spread/2)*average, ask )

  return getmakerconf().then( ({nOrders, depth}) => {
    let [bids,asks] = [bidStart, askStart].map( (start, ind) => {
      return [...Array(nOrders).keys()].map( iord => {
        let qty = 1 + (iord*iord)/5
        qty *= (1+Math.random()*0.3)*minqty/average

        let ieff = iord + 0.3*Math.random()
        let step = ieff * depth/nOrders
        step = ind===0 ? -step : step
        let price = (1 + step)*start

        return {qty, price}
      })
    })
    return {bids,asks}
  })
}

export {makebook}
