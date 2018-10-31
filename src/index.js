import { Trades } from './messages/messageTrades'
import { Orders } from './messages/messageOrders'
import { Orderbook } from './messages/messageOrderbook'
import { RawOrderbook } from './messages/messageRawOrderbook'

const ampMessages = {
  RawOrderbook: RawOrderbook,
  Orderbook: Orderbook,
  Orders: Orders,
  Trades: Trades
}

export default ampMessages
