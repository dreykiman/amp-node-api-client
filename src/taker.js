import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import keys from '../keys.json'
import {reverseAmount, reversePrice} from './utils/helpers'
import ws from './connection/wsclient'

const wallet = new Wallet(keys.AMPtaker)

const takeall = _ => {
  let pairName = "WETH/USDC"
  let [baseSym, quoteSym] = pairName.split('/')
  
  let quoteDec = amp.tokens.find(tok => tok.symbol===quoteSym).decimals
  let baseDec = amp.tokens.find(tok => tok.symbol===baseSym).decimals

  let orders = Object.values(amp.orderbook)
    .filter(ele=>ele.pairName===pairName)
    .filter(ele=>ele.status!="FILLED" && ele.status!="CANCELLED")

  orders.forEach(ele=>ele.price = reversePrice(ele.pricepoint, quoteDec))

  let buys = orders.filter(ele => ele.side==="BUY")
  let sells = orders.filter(ele => ele.side==="SELL")
  let wesell = Math.random() > 0.5 ? false : true

  if (wesell && buys.length>0) {
    let maxbuy = buys.reduce( (max, ele) => max.price>ele.price ? max : ele )
    let {amount, price, baseToken, quoteToken} = maxbuy
    amount = reverseAmount(amount, baseDec)
    let side = 'SELL'

    return amp.sign(wallet).neworder({side, amount, price, baseTokenAddress: baseToken, quoteTokenAddress: quoteToken})
  } else if (sells.length>0) {
    let minsell = sells.reduce( (min, ele) => min.price<ele.price ? min : ele )
    let {amount, price, baseToken, quoteToken} = minsell
    amount = reverseAmount(amount, baseDec)
    let side = 'BUY'

    return amp.sign(wallet).neworder({side, amount, price, baseTokenAddress: baseToken, quoteTokenAddress: quoteToken})
  }
  return Promise.reject("no order found")
}

Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
  .then( takeall )
  .catch(msg => console.log({err: msg.toString()}))
  .then(_=>ws.close())
 


