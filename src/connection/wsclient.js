import WebSocket from 'ws'
import messageListener from './listener'

let ws

const startWSclient = url => {
  ws = new WebSocket(url)

  ws.onmessage = messageListener

  ws.onerror = err => {
    console.log("error: "+err)
    process.exit()
  }

  ws.onclose = () => {
    console.log("Connection is closed...")
    process.exit()
  }

  return new Promise( (resolve, reject) => {
    ws.onopen = () => {
      console.log('Connection is open ...')
      resolve()
    }
  })
}

process.on( 'SIGUSR1', _ => ws.close() )

process.on('SIGINT', () => {
  console.log("Caught interrupt signal")
  ws.close()
  process.exit()
})

export {startWSclient, ws}
