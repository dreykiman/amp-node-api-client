
export const round = (n, decimals = '2') => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const validator = {
  get: function(target, name) {
    if (target[name] == null) {
        console.log("======== "+name+' is not in '+target);
        throw new Error(name+" is not defined")
    }

/* else if (typeof target[name] === 'object') {
        if (target[name]._proxy === undefined) {
          target[name]._proxy = new Proxy(target[name], validator)
        }
        return target[name]._proxy
    }
*/

    return target[name];
  }
}

