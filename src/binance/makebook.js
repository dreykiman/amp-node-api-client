export const makebook = ({bid,ask}) => {
  let average = (bid+ask)/2

  let minSpread = 0.1

  let bidStart = Math.min( (1-minSpread/2)*average, bid )
  let askStart = Math.max( (1+minSpread/2)*average, ask )

  let minQuantityInETH = 0.1
  let nOrders = 6
  let depth = 0.2

  let [bids,asks] = [bidStart, askStart].map( (start, ind) => {
    return [...Array(nOrders).keys()].map( iord => {
      let ieff = (iord + Math.random())/nOrders

      let qty = 1 + 3*ieff*ieff
      qty *= minQuantityInETH/average

      let step = ieff * depth
      step = ind===0 ? -step : step
      let price = (1 + step)*start

      return {qty, price}
    })
  })

  return {bids,asks}
}

