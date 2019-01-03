import * as amp from '../amp'
import {reverseAmount, reversePrice} from '../utils/helpers'

function takeone(pairName) {
  let [baseSym, quoteSym] = pairName.split('/')
  
  let orders = Object.values(amp.orderbook)
    .filter(ele=>ele.pairName===pairName)
    .filter(ele=>ele.status!="FILLED" && ele.status!="CANCELLED")

  let quoteDec = amp.tokens.find(tok => tok.symbol===quoteSym).decimals
  orders.forEach(ele=>ele.price = reversePrice(ele.pricepoint, quoteDec))

  let baseDec = amp.tokens.find(tok => tok.symbol===baseSym).decimals
  orders.forEach(ele=>ele.amount = reverseAmount(ele.amount, baseDec))

  let buys = orders.filter(ele => ele.side==="BUY")
  let sells = orders.filter(ele => ele.side==="SELL")
  let wesell = Math.random() > 0.5 ? false : true

  if (wesell && buys.length>0) {
    buys.sort( (a,b) => b.price - a.price )
    let {amount, price, baseToken, quoteToken} = buys[0]
    let side = 'SELL'

    return amp.sign(this.wallet).neworder({side, amount, price, baseTokenAddress: baseToken, quoteTokenAddress: quoteToken})
  } else if (sells.length>0) {
    sells.sort( (a,b) => a.price - b.price )
    let {amount, price, baseToken, quoteToken} = sells[0]
    let side = 'BUY'

    return amp.sign(this.wallet).neworder({side, amount, price, baseTokenAddress: baseToken, quoteTokenAddress: quoteToken})
  }
  return Promise.reject("no order found")
}

export {takeone}
