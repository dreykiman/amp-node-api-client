import express from 'express'
import rp from 'request-promise-native'

let app = express()
app.use(express.static('public'))

app.get('/api/pairs', (req, res) =>  {
  return rp('https://amp.exchange/api/pairs', {json: true})
    .then( data => {
      data.data.forEach( ele => {
        ele.pairName = `${ele.baseTokenSymbol}/${ele.quoteTokenSymbol}`
      })
      res.send(data.data)
    }).catch( msg => console.log(msg) )
})


app.get('/api/trades/binance', (req, res) =>  {
  return rp('https://api.binance.com/api/v1/trades?symbol='+req.query.pair, { json: true })
    .then(data => res.status(200).json(data))
    .catch( msg => console.log(msg) )
})


app.listen(3000, () => console.log('App listening on port 3000') )

