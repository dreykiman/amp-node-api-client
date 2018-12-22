import msgNewOrder from '../messages/messageNewOrder'
import ws from '../connection/wsclient'
import deferred from '../utils/deferred'


const neworder = order => msgNewOrder(order)
  .sign(this.wallet)
  .then( msg => ws.send(JSON.stringify(msg)) )
  .then( msg => {
    let {payload, hash} = msg.event
    let order = Object.assign(amp.orderbook[hash], payload)
    order.added = new deferred(40000)
    return order.added.promise
  }).catch( msg => {
    throw {err: 'new order failed', msg, msgstr: msg.toString(), order, time: Date.now()}
  })

export {neworder}

