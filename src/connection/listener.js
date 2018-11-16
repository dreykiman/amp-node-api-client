import orderbook, {subscriptions} from '../market/orderbook'
import {testNested} from '../utils/helpers'

export default ev => {
  let data
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log('return value is not valid JSON')
    throw {err: 'return value is not valid JSON'}
  }

  if (data.event && data.channel && data.event.payload) {
//console.log(ev.data)
    let {payload: pld, type} = data.event

    if (type === 'ORDER_CANCELLED') {
//      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].cancelled
      if (prm && prm.resolve) prm.resolve(data)

    } else if (type === 'ORDER_ADDED') {
//      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].added
      if (prm && prm.resolve) prm.resolve(data)

    } else if (data.channel === 'raw_orderbook') {
      let ords = pld
      if (type === 'INIT') {
        let pairName = pld.pairName
        ords = pld.orders
        if (subscriptions[pairName] && subscriptions[pairName].resolve) subscriptions[pairName].resolve()
      }

      if (ords) {
        ords.forEach( ord => {
          let {added, cancelled} = Object.assign(orderbook[ord.hash], ord) 

          if (added && added.resolve) {
//            console.log(`from raw: ${ord.status} ${ord.pairName} ${ord.pricepoint} ${ord.side} ${ord.baseToken}`)
            added.resolve({event: {payload: orderbook[ord.hash]}})
          }
          if (cancelled && cancelled.resolve) {
//            console.log(`from raw: ${ord.status} ${ord.pairName} ${ord.pricepoint} ${ord.side} ${ord.baseToken}`)
            cancelled.resolve({event: {payload: orderbook[ord.hash]}})
          }
        })
      }
    } else if (type === 'ERROR') {
      let { message='default', hash } = pld

      if ( message.includes("No order with this hash present")
      || message.includes("i/o timeout") ) {
        let {cancelled, added} = orderbook[hash]
        if (cancelled && cancelled.resolve) 
          cancelled.resolve({event: {payload: orderbook[hash]}})
        if (ord.added && ord.cancelled.resolve) 
          ord.added.resolve({event: {payload: orderbook[hash]}})
        delete orderbook[hash]
      }
      console.log(data)
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}

