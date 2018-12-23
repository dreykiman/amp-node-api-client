import Binance from 'binance-api-node'
import {reduce} from './reduce'
import {makebook} from './makebook'

const client = Binance()

const scaleQuote = ({pair, bids, asks}) => {
  let [base, quote] = pair.split('/')

  if (quote==='USDC' || quote==='DAI') {
    return client.book({ symbol: 'TUSDETH' })
      .then(reduce)
      .then( ({bid,ask}) => (bid+ask)/2 )
      .then( scale => {
        bids = bids.map( ({price, qty}) => ({price:price/scale, qty}) )
        asks = asks.map( ({price, qty}) => ({price:price/scale, qty}) )
        return {pair, bids, asks}
      })
  } else if (quote==='WETH') {
    return Promise.resolve({pair, bids, asks})
  }
  return Promise.reject({msg: 'unrecognized quote'})
}


export const makemarket = pairs => pairs.map(pair => {
  let [base, quote] = pair.split('/')

  return client.book({ symbol: base+'ETH' })
    .then(reduce)
    .then(makebook)
    .then(({bids, asks}) => ({pair, bids, asks}))
    .then(scaleQuote)
})
