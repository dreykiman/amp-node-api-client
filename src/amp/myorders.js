import {orderbook} from './orderbook'

/**
 * returns an array of orders made by this.wallet for specified pair name, if pair is not specified returns all orders
 * @memberof module:amp.sign
 * @param {string} [pair=undefined] - pair name
 * @instance
 * @returns {Array.<Order>} returns array of OPEN orders associated with this.wallet
 */
function myorders(pair) {
  return Object.values(orderbook)
    .filter( ele => this && this.wallet && this.wallet.address.toLowerCase()===ele.userAddress.toLowerCase() )
    .filter( ele => pair==undefined || pair===ele.pairName )
    .filter( ele => ele.status!="FILLED" && ele.status!="CANCELLED" )
}

export {myorders}
