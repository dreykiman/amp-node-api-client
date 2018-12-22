import rp from 'request-promise-native'

const info = { makeFee: {}, takeFee: {} }

const updateInfo = _ => rp('https://amp.exchange/api/info', {json: true})
  .then( data => data.data )
  .then( data => {
    info.exchangeAddress = data.exchangeAddress
    data.fees.forEach(ele=> {
      info.makeFee[ele.quote] = ele.makeFee
      info.takeFee[ele.quote] = ele.takeFee
    })
  }).catch(msg => {
    console.log("can not access AMP REST API server")
    throw msg;
  })


export {info, updateInfo}

