/**
 * @module binance
 */
import rp from 'request-promise-native'
import Binance from 'binance-api-node'
import {makebook} from './makebook'

const client = Binance()

/**
 * creates the lists of bids and asks for each pair in the supplied list by pulling the orderbook for each pair from CryptoCompare, and then calling {@link module:binance.makebook|makebook} to create the list of bids and asks for AMP.
 * @memberof module:binance
 * @param {Array.<Pair>} pairs - list of pairs to build new market orders for
 * @returns {Array.<Promise>} returns array of promises, where each promise returns the lists of new bid and ask amounts/prices based on pulled binance orderbook
 */
const createbooks = pairs => {
  let fsyms = pairs.map(ele=>{
    let base = ele.pairName.split('/')[0]
    return base==='WETH' ? 'ETH' : base
  }).filter( (val,ind,self) => self.indexOf(val) === ind)
  .join(',')

  let tsyms = pairs.map(ele=>{
    let quote = ele.pairName.split('/')[1]
    return quote==='WETH' ? 'ETH' : quote
  }).filter( (val,ind,self) => self.indexOf(val) === ind)
  .join(',')

  let book = rp("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+fsyms+"&tsyms="+tsyms, { json: true })

  return pairs.map( pair => {
    let pairName = pair.pairName
    let [base, quote] = pairName.split('/')

    let minqty = 3
    if(quote==="WETH") minqty = 0.03

    base = base==='WETH' ? 'ETH' : base
    quote = quote==='WETH' ? 'ETH' : quote

    return book.then(data => data[base][quote])
      .then(price => ({bid:price, ask:price, minqty}))
      .then(makebook)
      .then(({bids, asks}) => ({pair, bids, asks}))
  })
}

export {createbooks}
