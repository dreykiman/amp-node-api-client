import {orderbook} from '../amp'
import deferred from '../utils/deferred'

export const order_cancelled = data => {
  let pld = data.event.payload
//  if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)
  let {cancelled} = orderbook[pld.hash]

  if (cancelled && cancelled.resolve) cancelled.resolve(data)
}

export const order_added = data => {
  let pld = data.event.payload
//  if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)
  let {added} = orderbook[pld.hash]

  if (added && added.resolve) added.resolve(data)
}

export const order_pending = data => {
  let taker = data.event.payload.matches.takerOrder
  let {added} = Object.assign(orderbook[taker.hash], taker)

  if (added && added.resolve) added.resolve({event: {payload: orderbook[taker.hash]}})
//  orderbook[taker.hash].pending = new deferred(60000)
}

export const order_success = data => {
  let taker = data.event.payload.matches.takerOrder
  let {added, pending} = Object.assign(orderbook[taker.hash], taker)

  if (added && added.resolve) added.resolve({event: {payload: orderbook[taker.hash]}})
  if (pending && pending.resolve) pending.resolve({event: {payload: orderbook[taker.hash]}})
}

export const resolve_from_book = ords => {
  ords.forEach( ord => {
    let {added, cancelled} = Object.assign(orderbook[ord.hash], ord) 

    if (added && added.resolve) added.resolve({event: {payload: orderbook[ord.hash]}})
    if (cancelled && cancelled.resolve) cancelled.resolve({event: {payload: orderbook[ord.hash]}})
  })
}

export const reject_on_error = pld => {
  let { message, hash } = pld
  let {cancelled, added} = orderbook[hash]
  console.log(message)

  if (cancelled && cancelled.reject) cancelled.reject(message)
  if (added && added.reject) added.reject(message)

  delete orderbook[hash]
}

