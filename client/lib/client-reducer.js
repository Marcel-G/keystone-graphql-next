import { setCookie } from '../api/persist'

export const actionTypes = {
  CLIENT_LOGIN_SUCCESS: 'CLIENT_LOGIN_SUCCESS',
  CLIENT_LOGIN_FAILURE: 'CLIENT_LOGIN_FAILURE',
  CLIENT_LOGOUT: 'CLIENT_LOGOUT'
}

export const clientLoginSuccess = token => dispatch => {
  setCookie('token', token)
  return dispatch({ type: actionTypes.CLIENT_LOGIN_SUCCESS, token })
}

export const clientLogout = () => dispatch => {
  setCookie('token', '')
  return dispatch({ type: actionTypes.CLIENT_LOGOUT })
}

export const clientLoginFailure = () => dispatch => {
  return dispatch(clientLogout())
}

const getClient = state => state.client

const initialState = {
  token: '',
  loggedin: false
}

export const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLIENT_LOGIN_SUCCESS: return { ...state, token: action.token, loggedin: true }
    case actionTypes.CLIENT_LOGOUT: return { ...state, token: false, loggedin: false }
    default: return state
  }
}

export const actionCreators = {
  clientLoginSuccess,
  clientLoginFailure,
  clientLogout
}

export const selectors = {
  getClient
}
