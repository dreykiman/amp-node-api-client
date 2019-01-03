/**
 * module encapsulates functions to complex functions to make/take market
 * @module trader
 */
import {takeone} from './taker'
import {makeall} from './maker'

/**
 * Factory Function that returns market maker/taker
 * @memberof module:amp
 * @param {Wallet} wallet - wallet object from ethers object
 * @return {Object} object to provide access to market making/taking methods
 * @class
 */
const trader = wallet => ({
  wallet,
  takeone,
  makeall
})

export {trader}
