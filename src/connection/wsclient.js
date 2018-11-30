import WebSocket from 'ws'
import messageListener from './listener'


const createClient = () => {
  let ws = new WebSocket("wss://engine.amp.exchange/socket")

  ws.onmessage = messageListener

  ws.onerror = (err) => {
    console.log('err: ', err)
  }

  ws.onclose = () => {
    console.log("Connection is closed...")
    ws.isAlive = false
  }

  ws.onopen = (ev) => {
    console.log('Connection is open ...')
    ws.isAlive = true
    ws.send(JSON.stringify(
      {
        "channel": "orderbook",
        "event": {
          "type": "UNSUBSCRIBE",
       }
      }
    ))
  }


  ws.reopen = _ => {
    if( ws.readyState === ws.CLOSED ) {
      ws = createClient()
    }
  }

  return ws
}

process.on('SIGINT', () => {
  console.log("Caught interrupt signal")
  ws.close()
  setTimeout(process.exit, 500)
})


process.once('SIGUSR2', () => {
  ws.close()
  setTimeout(() => process.kill(process.pid, 'SIGUSR2'), 500)
})

let ws = createClient()

export default ws
