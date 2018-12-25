import {Wallet, getDefaultProvider} from 'ethers'
import * as amp from './amp'
import keys from '../keys.json'
import {delay, shuffleArray, reversePrice} from './utils/helpers'
import ws from './connection/wsclient'
import {createbooks} from './binance'

const wallet = new Wallet(keys.AMPmaker)

const createOrders = payload => {
  let {pair:{pairName, baseTokenAddress, quoteTokenAddress}, bids, asks} = payload
  let myords = amp.sign(wallet).myorders(pairName)

  let quote = amp.tokens.find(ele => ele.address.toLowerCase()===quoteTokenAddress.toLowerCase())
  let oldbids = myords.filter(ele=>ele.side==='BUY')
  oldbids.forEach( ele=> ele.price=reversePrice(ele.pricepoint, quote.decimals) )
  let oldasks = myords.filter(ele=>ele.side==='SELL')
  oldasks.forEach( ele=> ele.price=reversePrice(ele.pricepoint, quote.decimals) )

  let oldmaxbuy = oldbids.reduce( (max,ele) => Math.max(max, ele.price), 0 )
  let newmaxbuy = bids.reduce( (max,ele) => Math.max(max, ele.price), 0 )

  bids.forEach(ele=>ele.side='BUY')
  asks.forEach(ele=>ele.side='SELL')

  let buys = bids.concat(oldbids)
  shuffleArray(buys)
  let sels = asks.concat(oldasks)
  shuffleArray(sels)

  let ords = buys.concat(sels)
  if (newmaxbuy>oldmaxbuy) {
    ords = sels.concat(buys)
  }

  return ords.reduce( (seq, ord) => {
    let {qty, price, side} = ord
    let twait = 200*(0.8 + 0.4*Math.random())
    if (qty==undefined)
      return seq.then(_=>delay(twait)).then(_=>amp.sign(wallet).cancel(ord.hash))

    let order = {price, amount:qty, side, baseTokenAddress, quoteTokenAddress}
    return seq.then(_=>delay(twait)).then(_=>amp.sign(wallet).neworder(order))
  }, Promise.resolve()).catch(console.log)
}


const makeall = _ => {
  let books = createbooks(amp.pairs.slice(0,25))
    .map(bk => bk.then(createOrders))
    .map(bk => bk.catch(msg => console.log({msg})))

  return Promise.all(books).then(_=>console.log('alldone'))
}

Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map(pair => amp.subscribe(pair)) )
  .then( arr => Promise.all(arr) )
  .then( makeall )
  .catch(msg => console.log({err: msg.toString()}))
  .then(_=>ws.close())
 


