import Binance from 'binance-api-node'
import {reduce} from './reduce'
import {makebook} from './makebook'

const client = Binance()


export const createbooks = pairs => {
  let scaleUSD = client.book({ symbol: 'TUSDETH' })
    .then(reduce)
    .then( ({bid,ask}) => (bid+ask)/2 )
    .catch(msg => console.log({err: msg, log: 'TUSDETH'}))

  return pairs.map( pair => {
    let pairName = pair.pairName
    let [base, quote] = pairName.split('/')
    let symbol = base+'ETH'

    let scaleQuote = data => data
    if (pairName==='DAI/WETH') symbol = 'TUSDETH'
    else if(pairName==='WETH/USDC') symbol = 'ETHUSDC'
    else if (quote==='USDC' || quote==='DAI') {
      symbol = base+'ETH'
      scaleQuote = ({pair, bids, asks}) => scaleUSD.then( scale => {
        bids = bids.map( ({price, qty}) => ({price:price/scale, qty}) )
        asks = asks.map( ({price, qty}) => ({price:price/scale, qty}) )
        return {pair, bids, asks}
      })
    }

    return client.book({symbol})
      .then(reduce)
      .then(makebook)
      .then(({bids, asks}) => ({pair, bids, asks}))
      .then(scaleQuote)
  })
}
