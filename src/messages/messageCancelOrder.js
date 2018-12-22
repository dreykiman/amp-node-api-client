import { utils } from 'ethers'
import { round, randInt, validator } from '../utils/helpers'
import { getRandomNonce, getOrderHash, getOrderCancelHash } from '../utils/crypto'


const msgCancelOrder = orderHash => ({
  orderHash,

  async sign(signer) {
    let hash = getOrderCancelHash(this.orderHash)

    let signature = await signer.signMessage(utils.arrayify(hash))
    let { r, s, v } = utils.splitSignature(signature)
    signature = { R: r, S: s, V: v }
  
    return {
      "channel": "orders",
      "event": {
        "type": "CANCEL_ORDER",
        "hash": hash,
        "payload": {
          "hash": hash,
          "orderHash": this.orderHash,
          "signature": signature
        }
      }
    }
  }
})

export default msgCancelOrder

