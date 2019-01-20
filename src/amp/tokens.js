import rp from 'request-promise-native'

/**
 * Contains information about AMP server from {@link https://amp.exchange/api/tokens}.
 * User should call {@link module:amp.updateTokens|updateTokens} at the beginning to fill this array.
 * @type {Array.<Token>}
 * @member module:amp.tokens
 */
const tokens = []

/**
 * Fills array of {@link module:amp.tokens|tokens}.
 * Should be called at the beginning.
 * @see module:amp.tokens
 * @returns {Promise} Promise representing the request to https://amp.exchange/api/tokens
 * @memberof module:amp
 */
const updateTokens = ampurl => rp(ampurl + '/api/tokens', {json: true})
  .then( data => data.data )//.filter(ele => ele.quoteTokenSymbol === 'USDC' ) )
  .then( data => {
    data.forEach( ele => {
      tokens.push(ele)
    })
  }).catch(msg => {
    console.log("can not access AMP REST API server")
    throw msg
  })

export {tokens, updateTokens}
