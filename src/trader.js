import Trades from './messages/messageTrades'
import * as Order from './messages/messageOrder'
import Orderbook from './messages/messageOrderbook'
import RawOrderbook from './messages/messageRawOrderbook'
import wsclient from './wsclient'
import { Wallet, getDefaultProvider } from 'ethers'
import fs from 'fs'
import rp from 'request-promise-native'


export default class {
  constructor() {
    let keys = JSON.parse(fs.readFileSync("keys", "utf8"))
    let provider = getDefaultProvider('rinkeby');
    this.wallet = new Wallet(keys.AMP2, provider)
  }

  create_order() {
    let myorder = Order.new_order()
  }

  cancel_order() {
    Order.cancel_order(hash).sign(wallet)
      .then( ord => wsclient.send( JSON.stringify( ord ) ) )
  }

  my_orders() {
    return rp("http://13.125.100.61:8081/orders?address="+this.wallet.address, {json: true})
  }
}

wsclient.onmessage = (ev) => {
  console.log(ev.data)
}

