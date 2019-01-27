/**
 * @module marketmaker
 */
import rp from 'request-promise-native'
import {getpricelist} from './pricelist'
import {makebook} from './makebook'
import {getspreadmap} from '../datastore/firedata'

/**
 * creates the lists of bids and asks for each pair in the supplied list by pulling the orderbook for each pair from CryptoCompare, and then calling {@link module:marketmaker.makebook|makebook} to create the list of bids and asks for AMP.
 * @memberof module:marketmaker
 * @param {Array.<Pair>} pairs - list of pairs to build new market orders for
 * @returns {Array.<Promise>} returns array of promises, where each promise returns the lists of new bid and ask amounts/prices
 */
const createbooks = pairs => {
  const pricelist = getpricelist(pairs)

  return pairs.map( pair => {
    let pairName = pair.pairName
    let [base, quote] = pairName.split('/')

    let minqty = 3
    if(quote==="WETH") minqty = 0.03

    base = base==='WETH' ? 'ETH' : base
    quote = quote==='WETH' ? 'ETH' : quote

    const getprice = pricelist.then(data => data[base][quote])
    const getspread = getspreadmap().then(sprds => sprds[pairName] || sprds.default)

    return Promise.all([getprice, getspread])
      .then( ([price,spread]) => ({bid:price, ask:price, minqty, spread}))
      .then(makebook)
      .then(({bids, asks}) => ({pair, bids, asks}))
  })
}

export {createbooks}
