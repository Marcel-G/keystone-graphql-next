import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import NavButton from './nav-button'
import { actionCreators, selectors } from '../lib/client-reducer'

const logout = ({ clientLogout }) => {
  clientLogout()
}

const LoginButton = ({
    clientState,
    clientActions
}) => {
  const { loggedin } = clientState
  return loggedin
        ? <NavButton onClick={() => logout(clientActions)}>Logout</NavButton>
        : <NavButton href={'/login'}>Register / Login</NavButton>
}

const mapStateToProps = state => ({
  clientState: selectors.getClient(state)
})

const mapDispatchToProps = dispatch => ({
  clientActions: Object.keys(actionCreators).reduce((actions, key) => {
    actions[key] = (...args) => dispatch(actionCreators[key](...args))
    return actions
  }, {})
})

LoginButton.propTypes = {
  clientState: PropTypes.shape({
    loggedin: PropTypes.bool
  }),
  clientActions: PropTypes.shape({
    clientLogout: PropTypes.func
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton)
