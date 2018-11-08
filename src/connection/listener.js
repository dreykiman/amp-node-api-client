import wsclient from './wsclient'
import orderbook from '../market/orderbook'
import deferred from '../utils/deferred'

wsclient.onmessage = (ev) => {
  let data;
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log('return value is not valid JSON')
    throw new Error('return value is not valid JSON')
  }

  if (data.event) {
    if (data.event.type === 'ORDER_CANCELLED') {
      let pload = data.event.payload
      if (pload) console.log(`${pload.status} ${pload.pairName} ${pload.pricepoint} ${pload.side} ${pload.baseToken}`)

      let prm = orderbook[data.event.hash].cancelled
      if (prm) prm.resolve(data)
    } else if (data.event.type === 'ORDER_ADDED') {
      let pload = data.event.payload
      if (pload) console.log(`${pload.status} ${pload.pairName} ${pload.pricepoint} ${pload.side} ${pload.baseToken}`)

      let prm = orderbook[data.event.hash].added
      if (prm && prm.resolve) prm.resolve(data)
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}


