import WebSocket from 'ws';

const ws = new WebSocket("ws://13.125.100.61:8081/socket");

process.on('SIGINT', () => {
  console.log("Caught interrupt signal")
  ws.close()
  setTimeout(process.exit, 500)
});

process.once('SIGUSR2', () => {
  ws.close()
  setTimeout(() => process.kill(process.pid, 'SIGUSR2'), 500);
});

ws.onerror = (err) => {
  console.log('err: ', err);
}

ws.onclose = () => {
  console.log("Connection is closed...");
}

ws.onopen = (ev) => {
  console.log('Connection is open ...');
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
      ws = new WebSocket("ws://13.125.100.61:8081/socket")
    } else if( ws.readyState === ws.CONNECTING || ws.readyState === ws.OPEN ){
      return
    } else {
      ws.reopen();
    }
  }, 500)
}

export default ws
