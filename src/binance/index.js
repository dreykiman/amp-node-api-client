/**
 * @module binance
 */
import rp from 'request-promise-native'
import Binance from 'binance-api-node'
import {reduce} from './reduce'
import {makebook} from './makebook'

const client = Binance()

/**
 * creates the lists of bids and asks for each pair in the supplied list by pulling the orderbook for each pair from Binance, and then calling {@link module:binance.reduce|reduce} and {@link module:binance.makebook|makebook} to create the list of bids and asks for AMP.
 * Uses "TUSDETH" pair from Binace to scale ETH to DAI and USDC.
 * @memberof module:binance
 * @param {Array.<Pair>} pairs - list of pairs to build new market orders for
 * @returns {Array.<Promise>} returns array of promises, where each promise returns the lists of new bid and ask amounts/prices based on pulled binance orderbook
 */
const createbooks = pairs => {
  let scaleUSD = client.book({ symbol: 'TUSDETH' })
    .then(reduce)
    .then( ({bid,ask}) => (bid+ask)/2 )
    .catch(msg => console.log({err: msg, log: 'TUSDETH'}))

  return pairs.map( pair => {
    let pairName = pair.pairName
    let [base, quote] = pairName.split('/')
    let symbol = base+'ETH'

    let book = Promise.reject("Rejection that should never happen")
    let scaleQuote = data => data

    if (pairName==='DAI/WETH') symbol = 'TUSDETH'
    else if(pairName==='WETH/USDC') symbol = 'ETHUSDC'
    else if(pairName==='MKR/WETH') symbol = 'mkreth'
    else if(pairName==='MKR/USDC') symbol = 'mkrusd'
    else if(pairName==='MKR/DAI') symbol = 'mkrusd'
    else if (quote==='USDC' || quote==='DAI') {
      symbol = base+'ETH'
      scaleQuote = ({pair, bids, asks}) => scaleUSD.then( scale => {
        bids = bids.map( ({price, qty}) => ({price:price/scale, qty}) )
        asks = asks.map( ({price, qty}) => ({price:price/scale, qty}) )
        return {pair, bids, asks}
      })
    }

    if (base==="MKR") book = rp('https://api.bitfinex.com/v1/book/'+symbol, { json: true })
    else book = client.book({symbol})

    return book.then(reduce)
      .then(makebook)
      .then(({bids, asks}) => ({pair, bids, asks}))
      .then(scaleQuote)
  })
}

export {createbooks}
