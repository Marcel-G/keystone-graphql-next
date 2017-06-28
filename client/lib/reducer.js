import { combineReducers } from 'redux'
import { clientReducer } from './client-reducer'

export default function getReducer (client) {
  return combineReducers({
    apollo: client.reducer(),
    client: clientReducer
  })
}
