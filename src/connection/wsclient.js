import WebSocket from 'ws'
import messageListener from './listener'


const ws = new WebSocket("wss://amp.exchange/socket")

ws.onmessage = messageListener

ws.onerror = err => {
  console.log("error: "+err)
  process.exit()
}

ws.onclose = () => {
  console.log("Connection is closed...")
  process.exit()
}

ws.onopen = () => console.log('Connection is open ...')

process.on( 'SIGUSR1', _ => ws.close() )

process.on('SIGINT', () => {
  console.log("Caught interrupt signal")
  ws.close()
  process.exit()
})

export default ws
