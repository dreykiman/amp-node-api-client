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

    // The amountPrecisionMultiplier and pricePrecisionMultiplier are temporary multipliers
    // that are used to turn decimal values into rounded integers that can be converted into
    // big numbers that can be used to compute large amounts (ex: in wei) with the amountMultiplier
    // and priceMultiplier. After multiplying with amountMultiplier and priceMultiplier, the result
    // numbers are divided by the precision multipliers.
    // So in the end we have:
    // amountPoints ~ amount * amountMultiplier ~ amount * 1e18
    // pricePoints ~ price * priceMultiplier ~ price * 1e6
    let amountPrecisionMultiplier = 1e6
    let pricePrecisionMultiplier = 1e9

    let decimalsDiff = this.ord.baseTokenDecimals - this.ord.quoteTokenDecimals

    if (decimalsDiff < 0) throw { err: 'Pair currently not supported (decimals error)' }

    let defaultPriceMultiplier = utils.bigNumberify('1000000000')
    let decimalsPriceMultiplier = utils.bigNumberify((10 ** decimalsDiff).toString())

    let amountMultiplier = utils.bigNumberify((10 ** this.ord.baseTokenDecimals).toString())
    let priceMultiplier = defaultPriceMultiplier
    //  let priceMultiplier = defaultPriceMultiplier.mul(decimalsPriceMultiplier)

    let amount = round(this.ord.amount * amountPrecisionMultiplier, 0)
    let price = round(this.ord.price * pricePrecisionMultiplier, 0)
  
    let amountPoints = utils.bigNumberify(amount)
      .mul(amountMultiplier)
      .div(utils.bigNumberify(amountPrecisionMultiplier))

    let pricePoints = utils.bigNumberify(price)
      .mul(priceMultiplier)
      .div(utils.bigNumberify(pricePrecisionMultiplier))
  
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

