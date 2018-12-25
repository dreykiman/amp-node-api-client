import {cancel, cancelall} from './cancel'
import {neworder} from './neworder'
import {myorders} from './myorders'

/**
 * Factory Function that returns object with authorized access to AMP.
 * @memberof module:amp
 * @param {Wallet} wallet - wallet object from ethers object
 * @return {Object} object to provide access to signed methods
 * @class
 */

const sign = wallet => ({
  wallet,
  myorders,
  cancel,
  cancelall,
  neworder
})

export {sign}
