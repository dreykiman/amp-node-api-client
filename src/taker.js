import {Wallet, getDefaultProvider} from 'ethers'
import rp from 'request-promise-native'
import * as amp from './amp'
import {trader} from './trader'
import keys from '../keys.json'
import {startWSclient} from './connection/wsclient'
import {what2take, getconfig} from './datastore/firedata'
import {delay} from './utils/helpers'

const confname = process.argv.find(ele=>ele==='rinkeby') || 'default'

let wallet = new Wallet(keys.AMPtaker)
if (confname==='rinkeby')
  wallet = new Wallet(keys.rinkebyAMPtaker)

/**
 * @function taker
 * @desc
 * * Randomly decides to buy or sell WETH/USDC pair.
 * * Pulls the cheapest (most expensive) existing order and buys (sells) from it.
 */

console.log(new Date())
//check gas station recommendation to be below gasMax
let gasCheck = gasMax => rp('https://ethgasstation.info/json/ethgasAPI.json', {json:true})
    .then( ({average}) => {
      average /= 10
      if (gasMax && average>gasMax) return Promise.reject(`gas price: ${average}>${gasMax}`)
      return Promise.resolve()
    })

//connect to AMP: websocket/pairs/info/tokens
let ampConnected = (wsaddress, ampurl) => startWSclient(wsaddress)
    .then( _ => Promise.all([amp.updateInfo(ampurl), amp.updatePairs(ampurl), amp.updateTokens(ampurl)]) )

//determine which pairs to take: a) from command line or b) from firebase
let pairs2take = what2take(confname).then( pairs => {
  //if pairs are specified in command line, take them!
  let p2take = process.argv.slice(2).filter(sym => sym.split('/').length==2)
  if (p2take.length>0) return p2take

  //if no pairs are specified, pull pairs from firebase and roll the dice on taking them
  Object.keys(pairs).forEach(sym => {
    let rnd = Math.floor(Math.random()*pairs[sym])
    if(rnd===10) p2take.push(sym)
  })
  if (p2take.length>0) return p2take
  return Promise.reject('no pairs to take')
})

pairs2take
  .then( _ => getconfig(confname))
  .then( ({wsaddress, ampurl, gasMax}) => gasCheck(gasMax).then(_ => ampConnected(wsaddress, ampurl)) )
  .then( _ => pairs2take )
  .then( syms => amp.pairs.filter(pair => syms.includes(pair.pairName)) )
  .then( pairs => pairs.map(pair => delay(Math.random()*5000).then(_=>amp.subscribe(pair))) )
  .then( arr => Promise.all(arr) )
  .then( _ => pairs2take )
  .then( syms => syms.map(sym => trader(wallet).takeone(sym).catch(console.log)) )
  .then( arr => Promise.all(arr) )
  .catch( msg => console.log({msg, str: msg.toString(), err: JSON.stringify(msg), src: 'taker.js'}) )
  .then( _ => process.exit() )

