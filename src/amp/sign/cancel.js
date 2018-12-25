import msgCancelOrder from '../../messages/messageCancelOrder'
import ws from '../../connection/wsclient'
import deferred from '../../utils/deferred'
import {orderbook} from '../orderbook'

/**
 * cancels an order with specified hash
 * @memberof module:amp.sign
 * @param {string} hash
 * @returns {Promise} promise to cancel the order
 * @instance
 */
function cancel(hash) { return msgCancelOrder(hash)
  .sign(this.wallet)
  .then( msg => ws.send(JSON.stringify(msg)) )
  .then( msg => {
    let order = orderbook[hash]
    if (order.status == null || ( order.status!='CANCELLED' && order.status!='FILLED') ){
      order.cancelled = new deferred(35000)
    } else {
      order.cancelled = Promise.resolve()
    }
    return order.cancelled.promise
  }).catch( msg => {
      throw {err: 'cancel order failed', msg, hash, order: orderbook[hash], time: Date.now()}
  })
}

/**
 * cancels all orders for specified pair name, cancels all orders if name is undefined
 * @memberof module:amp.sign
 * @param {string} [pair=undefined] - pair name
 * @returns {Promise} promise to cancel the orders
 * @instance
 */
function cancelall(pair) { return this.myorders(pair)
  .map(ord => this.cancel(ord.hash))
}

export {cancel, cancelall}

