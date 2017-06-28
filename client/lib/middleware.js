import { applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

export default function createMiddleware (clientMiddleware) {
  const middleware = compose(applyMiddleware(clientMiddleware), applyMiddleware(thunkMiddleware))
  if (process.browser && window.devToolsExtension) {
    return compose(middleware, window.devToolsExtension())
  }
  return middleware
}
