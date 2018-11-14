import orderbook, {subscriptions} from '../market/orderbook'


export default ev => {
  let data
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log('return value is not valid JSON')
    throw {err: 'return value is not valid JSON'}
  }

  if (data.event && data.channel) {
//console.log(ev.data)
    if (data.event.type === 'ORDER_CANCELLED') {
      let pld = data.event.payload
//      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].cancelled
      if (prm && prm.resolve) prm.resolve(data)

    } else if (data.event.type === 'ORDER_ADDED') {
      let pld = data.event.payload
//      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].added
      if (prm && prm.resolve) prm.resolve(data)

    } else if (data.channel === 'raw_orderbook') {
      let pld = data.event.payload

      if (pld && data.event.type === 'INIT') {
        let pairName = pld.pairName
        pld = pld.orders
        if (subscriptions[pairName] && subscriptions[pairName].resolve) subscriptions[pairName].resolve()
      }

      if (pld) {
        pld.forEach( ord => {
          ord = Object.assign(orderbook[ord.hash], ord) 
          if (ord.added && ord.added.resolve) {
//            console.log(`from raw: ${ord.status} ${ord.pairName} ${ord.pricepoint} ${ord.side} ${ord.baseToken}`)
            ord.added.resolve({event: {payload: ord}})
          }
          if (ord.cancelled && ord.cancelled.resolve) {
//            console.log(`from raw: ${ord.status} ${ord.pairName} ${ord.pricepoint} ${ord.side} ${ord.baseToken}`)
            ord.cancelled.resolve({event: {payload: ord}})
          }
        })
      }
    } else if (data.event.type === 'ERROR') {
      if (data.event.payload.includes && data.event.payload.includes("No order with this hash present")){
        let hash = data.event.payload.split(":").slice(1)
        let ord = orderbook[hash]
        if (ord.cancelled && ord.cancelled.resolve) 
          ord.cancelled.resolve({event: {payload: ord}})
        if (ord.added && ord.cancelled.resolve) 
          ord.added.resolve({event: {payload: ord}})
      } else {
        console.log(JSON.stringify(orderbook))
      }
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}

