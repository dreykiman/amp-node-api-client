import express from 'express'
import {Wallet, getDefaultProvider} from 'ethers'
import router from './routes'
import * as amp from './amp'
import keys from '../keys.json'

import {makemarket} from './binance'

Promise.all(makemarket(["BNB/DAI", "BNB/WETH"]))
  .then(bk => JSON.stringify(bk,null,4))
  .then(console.log)
  .catch(console.log)


/*
//let provider = getDefaultProvider('rinkeby')
let wallet = new Wallet(keys.AMPmaker)


let app = express()
app.use(express.static('public'))
app.use('/api', router)

Promise.all([amp.updateInfo(), amp.updatePairs(), amp.updateTokens()])
  .then( _ => amp.pairs.map( pair => amp.subscribe(pair)) )
  .then( subs => Promise.all(subs) )
  .then( _ => {
const lst = amp.pairs.map(ele => `${ele.baseTokenSymbol}${ele.quoteTokenSymbol}`)
console.log(lst)
//    amp.sign(wallet).cancel('0xb6f5ca0d3ced829ebdc9e70dd0450154163c6af256015aebd823194cf3223b30')
  }).catch(msg => {
    console.log('fail')
    console.log(msg.toString())
  })
*/


/*
  }).then( _ => {
    app.listen(3001, () => console.log('App listening on port 3001'))
  }).catch( msg => {
    console.log(msg)
    process.exit()
  })
*/
