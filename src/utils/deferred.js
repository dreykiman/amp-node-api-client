export default class {
  constructor (timeOut) {
    this.promise = new Promise ( (res, rej) => {
      this.resolve = res
      this.reject = rej
    })

    if (timeOut != null) {
      setTimeout( _=> {
        console.log( "Promise rejected due to expiration timer" )
        this.reject( {err: "rejected due to expiration timer"} )
      }, timeOut )
    }
  }
}
