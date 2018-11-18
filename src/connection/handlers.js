import orderbook from '../market/orderbook'

export const order_cancelled = data => {
  let {payload:pld} = data.event
//  if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)
  let {cancelled} = orderbook[pld.hash]
  if (cancelled) cancelled.resolve(data)
}

export const order_added = data => {
  let {payload:pld} = data.event
//  if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)
  let {added} = orderbook[pld.hash]
  if (added) added.resolve(data)
}

export const resolve_from_book = ords => {
  ords.forEach( ord => {
    let {added, cancelled} = Object.assign(orderbook[ord.hash], ord) 

    if (added)
      added.resolve({event: {payload: orderbook[ord.hash]}})

    if (cancelled)
      cancelled.resolve({event: {payload: orderbook[ord.hash]}})
  })
}

export const reject_on_error = pld => {
  let { message, hash } = pld
  let {cancelled, added} = orderbook[hash]

  if (cancelled)
    cancelled.reject(message)

  if (added)
    added.reject(message)

  delete orderbook[hash]
}

