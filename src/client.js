import rp from 'request-promise-native'
import * as msgOrder from './messages/messageOrder'
import msgRawOrderbook from './messages/messageRawOrderbook'
import wsclient from './connection/wsclient'
import orderbook from './market/orderbook'
import pairs, {updatePairs} from './market/pairs'
import deferred from './utils/deferred'
import { utils } from 'ethers'


export default class {
  constructor(wallet) {
    this.wallet = wallet
  }


  start( func ) {
    return new Promise( (res, rej) => {
        wsclient.once('open', res)
      }).then( _ => {
        return updatePairs()
      })
  }


  submit( msg ) {
    wsclient.send(JSON.stringify(msg))
    return msg
  }


  new_order(order) {
    return msgOrder.new_order(order).sign(this.wallet)
      .then( this.submit )
      .then( msg => {
        let order = Object.assign(orderbook[msg.event.hash], msg.event.payload)
        order.added = new deferred(40000)
        return order.added.promise
      }).catch( msg => {
        throw new Error((msg.toString(), JSON.stringify(order)).join('\n'))
      })
  }


  cancel_order(hash) {
    return  msgOrder.cancel_order(hash).sign(this.wallet)
      .then( this.submit )
      .then( msg => {
        let order = orderbook[hash]
        if (order.status == null || ( order.status!='CANCELLED' && order.status!='FILLED') ){
          order.cancelled = new deferred(35000)
        } else {
          order.cancelled = Promise.resolve()
        }
        return order.cancelled.promise
      }).catch( msg => {
        throw new Error((msg.toString(), hash, JSON.stringify(orderbook[hash])).join('\n'))
      })
  }


  my_orders() {
    return Object.values(orderbook).filter(ord => utils.getAddress(ord.userAddress) === this.wallet.address)
//    return rp('http://ampapi:8081/orders?address='+this.wallet.address, {json: true})
//             .catch('couldn\'t access AMP REST API')
  }


  pairs() {
    return pairs()
  }


  subscribe (baseAddr, quoteAddr) {
    let ord = {
      baseToken: baseAddr,
      quoteToken: quoteAddr
    }
    this.submit(msgRawOrderbook.subscribe(ord))
  }
}


