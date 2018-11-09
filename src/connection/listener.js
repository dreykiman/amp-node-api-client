import orderbook from '../market/orderbook'
import deferred from '../utils/deferred'


export default ev => {
  let data
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log('return value is not valid JSON')
    throw new Error('return value is not valid JSON')
  }

  if (data.event && data.channel) {
    if (data.event.type === 'ORDER_CANCELLED') {
      let pld = data.event.payload
      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].cancelled
      if (prm) prm.resolve(data)

    } else if (data.event.type === 'ORDER_ADDED') {
      let pld = data.event.payload
      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].added
      if (prm && prm.resolve) prm.resolve(data)

    } else if (data.channel === 'raw_orderbook') {
      let pld = data.event.payload
      if (pld) {
        pld.forEach( ord => Object.assign(orderbook[ord.hash], ord) )

        if (pld.added) pld.added.resolve(data)
        if (pld.cancelled) pld.cancelled.resolve(data)
      }
      else console.log(data)

    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}

