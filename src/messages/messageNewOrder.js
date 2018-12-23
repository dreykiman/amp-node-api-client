import { utils } from 'ethers'
import { round, randInt, validator } from '../utils/helpers'
import { getRandomNonce, getOrderHash, getOrderCancelHash } from '../utils/crypto'
import { tokens } from '../amp/tokens'


const msgNewOrder = ord => ({
  ord: new Proxy(Object.assign({}, ord), validator),

  async sign(wallet) {
    let order = {}

    let baseToken = tokens.find(ele => ele.address.toLowerCase() === this.ord.baseTokenAddress.toLowerCase())
    let quoteToken = tokens.find(ele => ele.address.toLowerCase() === this.ord.quoteTokenAddress.toLowerCase())

    let precisionMultiplier = utils.bigNumberify(10).pow(9)
    let baseMultiplier = utils.bigNumberify(10).pow(baseToken.decimals)
    let quoteMultiplier = utils.bigNumberify(10).pow(quoteToken.decimals)
    let priceMultiplier = utils.bigNumberify(10).pow(18)

    let pricePoints = this.ord.price * precisionMultiplier
    pricePoints = utils.bigNumberify(pricePoints.toFixed(0))
    pricePoints = pricePoints.mul(priceMultiplier).mul(quoteMultiplier).div(precisionMultiplier)

    let amountPoints = this.ord.amount * precisionMultiplier
    amountPoints = utils.bigNumberify(amountPoints.toFixed(0))
    amountPoints = amountPoints.mul(baseMultiplier).div(precisionMultiplier)

    order.exchangeAddress = this.ord.exchangeAddress
    order.userAddress = wallet.address
    order.baseToken = this.ord.baseTokenAddress
    order.quoteToken = this.ord.quoteTokenAddress
    order.amount = amountPoints.toString()
    order.pricepoint = pricePoints.toString()
    order.side = this.ord.side
    order.makeFee = quoteToken.makeFee
    order.takeFee = quoteToken.takeFee
    order.nonce = getRandomNonce()
    order.hash = getOrderHash(order)

    let signature = await wallet.signMessage(utils.arrayify(order.hash))
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
})

export default msgNewOrder

