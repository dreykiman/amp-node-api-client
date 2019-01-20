import rp from 'request-promise-native'
import {getprices} from '../datastore/firedata'

/**
 * determine prices for tokens using cryptocompare, firebase database and logic
 * @memberof module:marketmaker
 * @param {Array.<Pair>} pairs - list of pairs to determine prices for
 * @returns {Array.<Promise>} returns array of promises, where each promise returns the prices for tokens
 */
const getpricelist = pairs => {
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
  const flatprices = rp("https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DAI&tsyms=USDC", {json:true})
    .then(scl => getprices.then(flt => {
      return Object.keys(flt).reduce( (coll, pairName) => {
        const [base,quote] = pairName.split('/')
        coll[base] = { 'USDC': flt[pairName],
          'DAI': flt[pairName]/scl.DAI.USDC,
          'ETH': flt[pairName]/scl.ETH.USDC }
        return coll
      }, {})
    }))
  return Promise.all([book, flatprices]).then( ([bk, flt]) => Object.assign(bk, flt) )
}

export {getpricelist}
