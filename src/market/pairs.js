import cache from 'memory-cache'
import rp from 'request-promise-native'

const updatePairs = _ => {
  return rp('http://ampapi:8081/pairs', {json: true})
    .then( data => { return data.data.filter(ele => ele.quoteTokenSymbol === 'WETH' ) } )
    .then( data => {
      data.forEach( ele => ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}` )
      cache.put('pairs', data)
      return data
    })
}

updatePairs()
setInterval(updatePairs, 600000)

export { updatePairs }
export default function() {
  return cache.get('pairs')
}
