export default class {
  constructor (timeOut, id) {
    this.promise = new Promise ( (res, rej) => {
      this.resolve = res
      this.reject = rej
    })

    if (timeOut != null) {
      setTimeout( _=> {
        this.reject( {err: "rejected due to expiration timer", id} )
      }, timeOut )
    }
  }
}
