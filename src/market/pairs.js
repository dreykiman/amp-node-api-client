import rp from 'request-promise-native'

let pairs = []

const updatePairs = _ => {
  return rp('https://amp.exchange/api/pairs', {json: true})
    .then( data => data.data )//.filter(ele => ele.quoteTokenSymbol === 'USDC' ) )
    .then( data => {
      data.forEach( ele => {
        ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      })
      pairs = data
      return pairs
    }).catch(msg => {
      console.log("can not access AMP REST API server")
    })
}

const updateInfo = _ => {
  return rp('https://amp.exchange/api/info', {json: true})
    .then( data => data.data )
    .catch(msg => {
      console.log("can not access AMP REST API server")
    })
}

updatePairs()
updateInfo()
setInterval(updatePairs, 600000)

export { updatePairs, updateInfo }
export default function() {
  return pairs
}

