import * as msgOrder from './messages/messageOrder'
import msgRawOrderbook from './messages/messageRawOrderbook'
import wsclient from './connection/wsclient'
import orderbook, {subscriptions} from './market/orderbook'
import pairs, {updatePairs, updateInfo} from './market/pairs'
import deferred from './utils/deferred'
import { utils } from 'ethers'


class AMPClient {
  constructor(wallet) {
    this.wallet = wallet
    this.ws = wsclient
  }

  info() {
    return updateInfo().then( info => {
      this.exchangeAddress = info.exchangeAddress
      this.makeFee = {}
      this.takeFee = {}
      into.fees.forEach(ele=> {
        this.makeFee[ele.quote] = ele.makeFee
        this.takeFee[ele.quote] = ele.takeFee
      })
    })
  }

  start() {
    return new Promise( (res, rej) => wsclient.once('open', res))
        .then( _ => info)
        .then( _ => updatePairs() )
        .then( pairs => {
          this.decimals = pairs.reduce( (decs, ele) => {
            decs[ele.baseTokenAddress] = ele.baseTokenDecimals
            decs[ele.quoteTokenAddress] = ele.quoteTokenDecimals
            return decs
          }, {})
          return pairs
        })
  }


  submit( msg ) {
    if (!wsclient.isAlive)
      throw {error: "websocket connections is closed"}
    wsclient.send(JSON.stringify(msg))
    return msg
  }


  new_order(order) {
    order.userAddress = this.wallet.address
    order.baseTokenDecimals = this.decimals[order.baseTokenAddress]
    order.quoteTokenDecimals = this.decimals[order.quoteTokenAddress]

    return msgOrder.new_order(order).sign(this.wallet)
      .then( this.submit )
      .then( msg => {
        let {payload, hash} = msg.event
        let order = Object.assign(orderbook[hash], payload)
        order.added = new deferred(40000)
        return order.added.promise
      }).catch( msg => {
        throw {err: 'new order failed', msg, msgstr: msg.toString(), order, time: Date.now()}
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
        throw {err: 'cancel order failed', msg, hash, order: orderbook[hash], time: Date.now()}
      })
  }


  my_orders(pair) {
    let myords = Object.values(orderbook)
      .filter(ord => ord.userAddress && ord.userAddress.toLowerCase() === this.wallet.address.toLowerCase())
    return myords
    return myords.filter(ele => pair==null || ele.pairName == pair)
  }


  pairs() {
    return pairs()
  }


  subscribe (baseAddr, quoteAddr) {
    let ord = {
      baseToken: baseAddr,
      quoteToken: quoteAddr
    }
    let pair = this.pairs().find(ele => ele.baseTokenAddress === baseAddr && ele.quoteTokenAddress === quoteAddr)
    let pairName = `${pair.baseTokenSymbol}/${pair.quoteTokenSymbol}`
    subscriptions[pairName] = new deferred(20000)
    this.submit(msgRawOrderbook.subscribe(ord))

    return subscriptions[pairName].promise
  }
}

export default AMPClient
