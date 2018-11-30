import rp from 'request-promise-native'

let pairs = []

const updatePairs = _ => {
  return rp('http://ampapi:8081/pairs', {json: true})
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

const updateFees = _ => {
  return rp('http://ampapi:8081/info/fees', {json: true})
    .then( data => data.data )
    .catch(msg => {
      console.log("can not access AMP REST API server")
    })
}

updatePairs()
updateFees()
setInterval(updatePairs, 600000)

export { updatePairs, updateFees }
export default function() {
  return pairs
}

