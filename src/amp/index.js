export * from './pairs'
export * from './info'
export * from './orderbook'
export * from './tokens'

import {cancel, cancelall} from './cancel'
import {neworder} from './neworder'
import {myorders} from './myorders'

export const sign = wallet => ({
  wallet,
  myorders,
  cancel,
  cancelall,
  neworder
})
