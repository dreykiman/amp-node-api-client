import { utils } from 'ethers'
import { round, randInt, validator } from '../utils/helpers';
import { getRandomNonce, getOrderHash } from '../utils/crypto';


export class Orders {
  constructor(signer) {
    this.signer = signer
    return new Proxy(this, validator);
  }

  async new_order() {
    let order = {};

    // The amountPrecisionMultiplier and pricePrecisionMultiplier are temporary multipliers
    // that are used to turn decimal values into rounded integers that can be converted into
    // big numbers that can be used to compute large amounts (ex: in wei) with the amountMultiplier
    // and priceMultiplier. After multiplying with amountMultiplier and priceMultiplier, the result
    // numbers are divided by the precision multipliers.
    // So in the end we have:
    // amountPoints ~ amount * amountMultiplier ~ amount * 1e18
    // pricePoints ~ price * priceMultiplier ~ price * 1e6
    let amountPrecisionMultiplier = 1e6
    let pricePrecisionMultiplier = 1e6
    let amountMultiplier = utils.bigNumberify('1000000000000000000') //1e18
    let priceMultiplier = utils.bigNumberify('1000000') //1e6
    let amount = round(this.amount * amountPrecisionMultiplier, 0)
    let price = round(this.price * pricePrecisionMultiplier, 0)
  
    let amountPoints = utils
      .bigNumberify(amount)
      .mul(amountMultiplier)
      .div(utils.bigNumberify(amountPrecisionMultiplier))
    let pricePoints = utils
      .bigNumberify(price)
      .mul(priceMultiplier)
      .div(utils.bigNumberify(pricePrecisionMultiplier))
  
    order.userAddress = this.userAddress
    order.exchangeAddress = this.exchangeAddress
    order.buyToken = this.side === 'BUY' ? this.baseTokenAddress : this.quoteTokenAddress
    order.buyAmount = this.side === 'BUY'
      ? amountPoints.toString()
      : amountPoints.mul(pricePoints).div(priceMultiplier).toString()
  
    order.sellToken = this.side === 'BUY' ? this.quoteTokenAddress : this.baseTokenAddress
    order.sellAmount = this.side === 'BUY'
      ? amountPoints.mul(pricePoints).div(priceMultiplier).toString()
      : amountPoints.toString()
  
    order.makeFee = this.makeFee
    order.takeFee = this.takeFee
    order.nonce = getRandomNonce()
    order.expires = '10000000000000'
    order.hash = getOrderHash(order)

    let signature = await this.signer.signMessage(utils.arrayify(order.hash))
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

