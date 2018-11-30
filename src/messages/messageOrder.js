import { utils } from 'ethers'
import { round, randInt, validator } from '../utils/helpers'
import { getRandomNonce, getOrderHash, getOrderCancelHash } from '../utils/crypto'



class msgOrder {
  constructor(ord) {
    this.ord = Object.assign( {}, ord )
    this.ord = new Proxy( this.ord, validator )
  }

  async sign(signer) {
    let order = {}

    let precisionMultiplier = utils.bigNumberify(10).pow(9)
    let baseMultiplier = utils.bigNumberify(10).pow(this.ord.baseTokenDecimals)
    let quoteMultiplier = utils.bigNumberify(10).pow(this.ord.quoteTokenDecimals)
    let priceMultiplier = utils.bigNumberify(10).pow(18)

    let pricePoints = this.ord.price * precisionMultiplier
    pricePoints = utils.bigNumberify(pricePoints.toFixed(0))
    pricePoints = pricePoints.mul(priceMultiplier).mul(quoteMultiplier).div(precisionMultiplier)

    let amountPoints = this.ord.amount * precisionMultiplier
    amountPoints = utils.bigNumberify(amountPoints.toFixed(0))
    amountPoints = amountPoints.mul(baseMultiplier).div(precisionMultiplier)

    order.exchangeAddress = this.ord.exchangeAddress
    order.userAddress = this.ord.userAddress
    order.baseToken = this.ord.baseTokenAddress
    order.quoteToken = this.ord.quoteTokenAddress
    order.amount = amountPoints.toString()
    order.pricepoint = pricePoints.toString()
    order.side = this.ord.side
    order.makeFee = this.ord.makeFee.toString()
    order.takeFee = this.ord.takeFee.toString()
    order.nonce = getRandomNonce()
    order.hash = getOrderHash(order)

    let signature = await signer.signMessage(utils.arrayify(order.hash))
    let { r, s, v } = utils.splitSignature(signature)
    order.signature = { R: r, S: s, V: v }

    return {
      "channel": "orders",
      "event": {
        "type": "NEW_ORDER",
        "hash": order.hash,
        "payload": order
      }
    }
  }
}

class msgOrderCancellation {
  constructor(orderHash) {
    this.orderHash = orderHash
  }

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
}

export const new_order = ord => new msgOrder(ord)
export const cancel_order = hash => new msgOrderCancellation(hash)

