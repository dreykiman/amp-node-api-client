import rp from 'request-promise-native'

/**
 * Contains information about AMP server from {@link https://amp.exchange/api/tokens}.
 * User should call {@link module:amp.updatePairs|updatePairs} at the beginning to fill this array.
 * @type {Array.<Pair>}
 * @member module:amp.pairs
 */
const pairs = []

/**
 * Fills array of {@link module:amp.pairs|pairs}.
 * Should be called at the beginning.
 * @see module:amp.pairs
 * @returns {Promise} Promise representing the request to https://amp.exchange/api/pairs
 * @memberof module:amp
 */
const updatePairs = (ampurl, whitelist) => rp(ampurl + '/api/pairs', {json: true})
  .then( data => data.data )//.filter(ele => ele.quoteTokenSymbol === 'USDC' ) )
  .then( data => {
    data.forEach( ele => {
      ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      if(ele.listed && (whitelist==undefined || whitelist.includes(ele.baseTokenSymbol))) pairs.push(ele)
    })
  }).catch(msg => {
    console.log("can not access AMP REST API server")
    throw msg
  })

export {pairs, updatePairs}
