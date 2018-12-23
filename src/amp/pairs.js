import rp from 'request-promise-native'

const pairs = []

const updatePairs = _ => rp('https://amp.exchange/api/pairs', {json: true})
  .then( data => data.data )//.filter(ele => ele.quoteTokenSymbol === 'USDC' ) )
  .then( data => {
    data.forEach( ele => {
      ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      pairs.push(ele)
    })
  }).catch(msg => {
    console.log("can not access AMP REST API server")
    throw msg
  })

export {pairs, updatePairs}
