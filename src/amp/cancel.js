import msgCancelOrder from '../messages/messageCancelOrder'
import ws from '../connection/wsclient'
import deferred from '../utils/deferred'


const cancel = hash => msgCancelOrder(hash)
  .sign(this.wallet)
  .then( msg => ws.send(JSON.stringify(msg)) )
  .then( msg => {
    let order = amp.orderbook[hash]
    if (order.status == null || ( order.status!='CANCELLED' && order.status!='FILLED') ){
      order.cancelled = new deferred(35000)
    } else {
      order.cancelled = Promise.resolve()
    }
    return order.cancelled.promise
  }).catch( msg => {
      throw {err: 'cancel order failed', msg, hash, order: amp.orderbook[hash], time: Date.now()}
  })

export {cancel}

