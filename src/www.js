import express from 'express'
import rp from 'request-promise-native'

let app = express()
app.use(express.static('public'))

app.listen(3000, () => console.log('App listening on port 3000') )

