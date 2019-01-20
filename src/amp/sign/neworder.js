import msgNewOrder from '../../messages/messageNewOrder'
import {ws} from '../../connection/wsclient'
import deferred from '../../utils/deferred'
import {orderbook} from '../orderbook'


/**
 * add new order
 * @memberof module:amp.sign
 * @param {Object} order - order structure
 * @param {Number|string} order.price - price
 * @param {Number|string} order.amount - amount
 * @param {string} order.side - "SELL" or "BUY"
 * @param {string} order.baseTokenAddress - base token address
 * @param {string} order.quoteTokenAddress - quote token address
 * @instance
 * @returns {Promise} promise to create order
 */
function neworder(order) { return msgNewOrder(order)
  .sign(this.wallet)
  .then( msg => {
    ws.send(JSON.stringify(msg))

    let {payload, hash} = msg.event
    let order = Object.assign(orderbook[hash], payload)
    order.added = new deferred(40000)
    return order.added.promise
  }).catch( msg => {
    throw {err: 'new order failed', msg, msgstr: msg.toString(), order, time: Date.now()}
  })
}

export {neworder}
