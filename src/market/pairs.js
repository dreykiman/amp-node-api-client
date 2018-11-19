import rp from 'request-promise-native'

let pairs = []

const updatePairs = _ => {
  return rp('http://ampapi:8081/pairs', {json: true})
    .then( data => data.data.filter(ele => ele.quoteTokenSymbol === 'WETH' ) )
    .then( data => {
      data.forEach( ele => {
        ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      })
      pairs = data
      return pairs
    })
}

updatePairs()
setInterval(updatePairs, 600000)

export { updatePairs }
export default function() {
  return pairs
}
