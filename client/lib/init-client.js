import { ApolloClient } from 'react-apollo'
import { createNetworkInterface } from 'apollo-upload-client'

let apolloClient = null

function _initClient (headers, initialState) {
  const uri = 'http://localhost:3001/api'
  const networkInterface = createNetworkInterface({
    uri,
    batchInterval: 10
  })
  networkInterface.use([{
    applyMiddleware (req, next) {
      if (!req.options.headers) {
        req.options.headers = {}  // Create the header object if needed.
      }
      const token = (initialState.client && initialState.client.token)
      req.options.headers.authorization = token ? `Bearer ${token}` : null
      next()
    }
  }])
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface
  })
}

export const initClient = (headers, initialState = {}) => {
  if (!process.browser) {
    return _initClient(headers, initialState)
  }
  if (!apolloClient) {
    apolloClient = _initClient(headers, initialState)
  }
  return apolloClient
}
