import * as amp from '../amp'
import {delay, shuffleArray, reversePrice} from '../utils/helpers'
import {createbooks} from '../marketmaker'


function makeOrders(payload) {
  let {pair:{pairName, baseTokenAddress, quoteTokenAddress}, bids, asks} = payload
  let myords = amp.sign(this.wallet).myorders(pairName)

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
//    return Promise.resolve()
    if (qty==undefined)
      return seq.then(_=>delay(twait)).then(_=>amp.sign(this.wallet).cancel(ord.hash))

    let order = {price, amount:qty, side, baseTokenAddress, quoteTokenAddress}
    return seq.then(_=>delay(twait)).then(_=>amp.sign(this.wallet).neworder(order)).catch(console.log)
  }, Promise.resolve())
}


function makeall(pairs) {
  let books = createbooks(pairs)
    .map(bk => bk.then(makeOrders.bind(this)))
    .map(bk => bk.catch(msg => console.log({msg, src: 'maker'})))

  return Promise.all(books).then(_=>console.log('alldone'))
}


export {makeall}
