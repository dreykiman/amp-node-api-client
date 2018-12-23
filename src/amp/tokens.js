import rp from 'request-promise-native'

const tokens = []

const updateTokens = _ => rp('https://amp.exchange/api/tokens', {json: true})
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
