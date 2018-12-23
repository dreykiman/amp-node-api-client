export * from './pairs'
export * from './info'
export * from './orderbook'
export * from './tokens'

import {cancel} from './cancel'
import {neworder} from './neworder'

export const sign = wallet => ({
  wallet,
  cancel,
  neworder
})
