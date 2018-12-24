import {orderbook} from './orderbook'

function myorders(pair) {
  return Object.values(orderbook)
    .filter( ele => this && this.wallet && this.wallet.address.toLowerCase()===ele.userAddress.toLowerCase() )
    .filter( ele => pair==undefined || pair===ele.pairName )
    .filter( ele => ele.status!="FILLED" && ele.status!="CANCELLED" )
}

export {myorders}
