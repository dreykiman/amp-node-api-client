import rp from 'request-promise-native'

const pairs = []

const updatePairs = _ => {
  return rp('http://ampapi:8081/pairs', {json: true})
    .then( data => data.data.filter(ele => ele.quoteTokenSymbol === 'WETH' ) )
    .then( data => {
      data.forEach( ele => {
        ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
        pairs.push(ele)
      })
      return data
    })
}

updatePairs()
setInterval(updatePairs, 600000)

export { updatePairs }
export default pairs
