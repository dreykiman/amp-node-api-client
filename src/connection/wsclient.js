import WebSocket from 'ws'
import orderbook from '../market/orderbook'
import deferred from '../utils/deferred'

const ws = new WebSocket("ws://ampapi:8081/socket")


process.on('SIGINT', () => {
  console.log("Caught interrupt signal")
  ws.close()
  setTimeout(process.exit, 500)
})


process.once('SIGUSR2', () => {
  ws.close()
  setTimeout(() => process.kill(process.pid, 'SIGUSR2'), 500)
})


ws.onerror = (err) => {
  console.log('err: ', err)
}


ws.onclose = () => {
  console.log("Connection is closed...")
}


ws.onopen = (ev) => {
  console.log('Connection is open ...')
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
  setTimeout( _ => {
    if( ws.readyState === ws.CLOSED ) {
      ws = new WebSocket("ws://ampapi:8081/socket")
    } else if( ws.readyState === ws.CONNECTING || ws.readyState === ws.OPEN ){
      return
    } else {
      ws.reopen()
    }
  }, 500)
}


ws.onmessage = (ev) => {
  let data;
  try {  
    data = JSON.parse(ev.data)
  } catch (ev) {
    console.log('return value is not valid JSON')
    throw new Error('return value is not valid JSON')
  }

  if (data.event && data.channel) {
    if (data.event.type === 'ORDER_CANCELLED') {
      let pld = data.event.payload
      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].cancelled
      if (prm) prm.resolve(data)
    } else if (data.event.type === 'ORDER_ADDED') {
      let pld = data.event.payload
      if (pld) console.log(`${pld.status} ${pld.pairName} ${pld.pricepoint} ${pld.side} ${pld.baseToken}`)

      let prm = orderbook[pld.hash].added
      if (prm && prm.resolve) prm.resolve(data)
    } else if (data.channel === 'raw_orderbook') {
      let pld = data.event.payload
      if(pld) pld.forEach( ord => {
        Object.assign(orderbook[ord.hash], ord)
      })
      else console.log(data)
    } else {
      console.log(data)
    }
  } else {
    console.log(data)
  }
}

export default ws
