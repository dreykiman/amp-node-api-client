import rp from 'request-promise-native'

/**
 * contains information about AMP server from {@link https://amp.exchange/api/info}.
 * User should call {@link module:amp.updateInfo|updateInfo} at the beginning to fill this array.
 * @type {Info}
 * @member module:amp.info
 */
const info = { makeFee: {}, takeFee: {} }

/**
 * Pulls {@link module:amp.info|info} object.
 * Should be called at the beginning.
 * @see module:amp.info
 * @returns {Promise} Promise representing the request to https://amp.exchange/api/info
 * @memberof module:amp
 */
const updateInfo = ampurl => rp(ampurl + '/api/info', {json: true})
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

