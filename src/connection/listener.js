import {subscriptions} from '../market/orderbook'
import * as handlers from './handlers'

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

    if (type === 'ORDER_CANCELLED')
      handlers.order_cancelled(data)
    else if (type === 'ORDER_ADDED')
      handlers.order_added(data)
//    else if (type === 'ORDER_PENDING')
//      handlers.order_pending(data)
//    else if (type === 'ORDER_SUCCESS')
//      handlers.order_success(data)
    else if (data.channel === 'raw_orderbook') {
      let ords = pld
      if (type === 'INIT') {
        let pairName = pld.pairName
        ords = pld.orders
        if (subscriptions[pairName]) subscriptions[pairName].resolve()
      }
      if (ords)
        handlers.resolve_from_book(ords)
    } else if (type === 'ERROR') {
      handlers.reject_on_error(pld)

      console.log(data)
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
//    console.log(data)
}

