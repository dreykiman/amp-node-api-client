import rp from 'request-promise-native'

const pairs = []
const decimals = {}
const tokenSymbols = {}

const updatePairs = _ => rp('https://amp.exchange/api/pairs', {json: true})
  .then( data => data.data )//.filter(ele => ele.quoteTokenSymbol === 'USDC' ) )
  .then( data => {
    data.forEach( ele => {
      ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      pairs.push(ele)

      tokenSymbols[ele.baseTokenAddress] = ele.baseTokenSymbol
      tokenSymbols[ele.quoteTokenAddress] = ele.quoteTokenSymbol

      decimals[ele.baseTokenAddress] = ele.baseTokenDecimals
      decimals[ele.quoteTokenAddress] = ele.quoteTokenDecimals
    })
  }).catch(msg => {
    console.log("can not access AMP REST API server")
    throw msg
  })

export {pairs, decimals, updatePairs, tokenSymbols}
