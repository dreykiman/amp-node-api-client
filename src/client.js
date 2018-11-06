import rp from 'request-promise-native'
import * as msgOrder from './messages/messageOrder'
import wsclient from './connection/wsclient'
import orderbook from './market/orderbook'
import deferred from './utils/deferred'


export default class {
  constructor(wallet) {
    this.wallet = wallet
  }

  once( func ) {
    wsclient.once("open", func)
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
        order.added = new deferred(20000)
        return order.added.promise
      })
      .catch( msg => { return { error: msg.toString() }})
  }


  cancel_order(hash) {
    return  msgOrder.cancel_order(hash).sign(this.wallet)
      .then( this.submit )
      .then( msg => {
        let order = orderbook[hash]
        if (order.status == null || ( order.status!="CANCELLED" && order.status!="FILLED") ){
          order.cancelled = new deferred(15000)
        } else {
          order.cancelled = Promise.resolve()
        }
        return order.cancelled.promise
      })
      .catch( msg => {return { error: msg.toString() }} )
  }


  my_orders() {
    return rp("http://ampapi:8081/orders?address="+this.wallet.address, {json: true})
             .catch("couldn't access AMP REST API")
  }

  pairs() {
    return rp("http://ampapi:8081/pairs", {json: true})
             .then( data => { return data.data.filter(ele => ele.quoteTokenAddress == "0xa3f9eacdb960d33845a4b004974feb805e05c4a9" ) } )
             .catch("couldn't access AMP REST API")
  }
}




wsclient.onmessage = (ev) => {
  let data;
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log("return value is not valid JSON")
    throw new Error("return value is not valid JSON")
  }

  if (data.event) {
    if (data.event.type === "ORDER_CANCELLED") {
      let pload = data.event.payload
      if (pload) console.log(`${pload.status} ${pload.pairName} ${pload.pricepoint} ${pload.side}`)

      let prm = orderbook[data.event.hash].cancelled
      if (prm) prm.resolve(data)
    } else if (data.event.type === "ORDER_ADDED") {
      let pload = data.event.payload
      if (pload) console.log(`${pload.status} ${pload.pairName} ${pload.pricepoint} ${pload.side}`)

      let prm = orderbook[data.event.hash].added
      if (prm && prm.resolve) prm.resolve(data)
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}

