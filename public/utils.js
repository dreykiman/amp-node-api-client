function reversePrice(pricepoint, quoteDec) {
  let precisionMultiplier = 1e9
  let priceMultiplier = ethers.utils.bigNumberify(10).pow(18)
  let quoteMultiplier = ethers.utils.bigNumberify(10).pow(quoteDec)
  pricepoint = ethers.utils.bigNumberify(pricepoint)
  pricepoint = pricepoint.mul(precisionMultiplier).div(priceMultiplier).div(quoteMultiplier)

  let price = pricepoint.toString()/precisionMultiplier
//console.log(pricepoint+" "+price)
  return price
}

function reverseAmount(amount, baseDec) {
  let precisionMultiplier = 1e9
  let baseMultiplier = ethers.utils.bigNumberify(10).pow(baseDec)
  amount = ethers.utils.bigNumberify(amount)
  amount = amount.mul(precisionMultiplier).div(baseMultiplier)
console.log(baseDec)

  return amount.toString()/precisionMultiplier
}

var wsaddr = "ws://ampapi:8081/socket"
var wsaddr = "wss://amp.exchange/socket"
