export const PLACEHOLDER = Symbol('PLACEHOLDER')

const basePartial = (fn, args) => fn.bind(null, ...args)

const nextPlaceholderIdx = args => args.indexOf(PLACEHOLDER)

export const isFunction = t => t ? typeof t === 'function' : false

export const pipe = (first, ...rest) => (...args) =>
  rest.reduce((result, fn) => fn(result), first(...args))

export const combineHOCs = pipe

export const compose = (...fns) => {
  const reverseFns = fns.reverse()
  return (...args) => {
    reverseFns.forEach(fn => {
      if (!Array.isArray(args)) {
        args = [args]
      }
      args = fn(...args)
    })
    return args
  }
}

export const curry = fn => (...args) => {
  if (nextPlaceholderIdx(args) === -1) {
    return args.length >= fn.length ? fn(...args) : curry(basePartial(fn, args))
  }

  return (...nextArgs) => {
    let newArgs = args.map(v => ((v === PLACEHOLDER) && nextArgs.length) ? nextArgs.shift() : v)
    newArgs = newArgs.concat(nextArgs)

    return (newArgs.length >= fn.length) && nextPlaceholderIdx(newArgs) === -1
      ? fn(...newArgs)
      : curry(fn)(...newArgs)
  }
}

export const bindAll = curry((attrs, context) => {
  (Array.isArray(attrs) && attrs.length ? attrs : Object.keys(context))
    .filter(key => isFunction(context[key]))
    .forEach(key => { context[key] = context[key].bind(context) })
})
