import React, { Component, PropTypes } from 'react'
import Router from 'next/router'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui/lib'
import { gql, graphql } from 'react-apollo'
import { RaisedButton } from 'material-ui'
import { compose, bindAll } from '../utils/function'
import { connect } from 'react-redux'
import { actionCreators, selectors } from '../lib/client-reducer'

const errorMessages = {
  invalidEmail: 'Email is not valid'
}

class LoginForm extends Component {
  constructor ({ clientState }) {
    super()
    this.state = {
      canSubmit: false
    }
    bindAll([
      'enableButton',
      'disableButton',
      'submitForm'
    ], this)
  }
  componentDidMount () {
    if (this.props.clientState.loggedin) Router.push({ pathname: '/' })
  }
  submitForm = data => {
    const { login, clientActions } = this.props
    const { email, password } = data
    login(email, password).then(({ data }) => {
      const { token, errors } = data.login
      if (errors && errors.length > 0) {
        this.form.updateInputsWithError(errors.reduce((update, { field, message }) => (
          { ...update, [field]: message }
        ), {}))
      } else if (token) {
        clientActions.clientLoginSuccess(token)
        window.location = `/`
      }
    }).catch(error => {
      clientActions.clientLoginFailure(error)
    })
  }

  enableButton () {
    this.setState({
      canSubmit: true
    })
  }

  disableButton () {
    this.setState({
      canSubmit: false
    })
  }

  render () {
    return (
      <section>
          <Formsy.Form
            ref={form => { this.form = form }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submitForm} >
              <FormsyText
                  floatingLabelText="Email"
                  name="email"
                  validationError={errorMessages.invalidEmail}
                  validations="isEmail"
                  required
                  style={{
                    display: 'block',
                    width: '100%' }} />
              <FormsyText
                  floatingLabelText="Password"
                  name="password"
                  required
                  style={{
                    display: 'block',
                    width: '100%' }}
                  type="password" />
              <RaisedButton
                  type="submit"
                  disabled={!this.state.canSubmit}
                  primary
                  fullWidth
                  style={{ marginTop: '2em' }}
                  label={'Login'} />
          </Formsy.Form>
      </section>
    )
  }
}

const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      errors {
        field
        message
      }
    }
  }
`

const mapStateToProps = state => ({
  clientState: selectors.getClient(state)
})

const mapDispatchToProps = dispatch => ({
  clientActions: Object.keys(actionCreators).reduce((actions, key) => {
    actions[key] = (...args) => dispatch(actionCreators[key](...args))
    return actions
  }, {})
})

LoginForm.propTypes = {
  clientState: PropTypes.shape({
    clientLoginSuccess: PropTypes.func,
    clientLoginFailure: PropTypes.func
  }),
  clientActions: PropTypes.shape({
    loggedin: PropTypes.bool
  }),
  login: PropTypes.func
}

export default compose(
    graphql(login, {
      props: ({ mutate }) => ({
        login: (email, password) => mutate({
          variables: { email, password }
        })
      })
    }),
  connect(mapStateToProps, mapDispatchToProps)
)(LoginForm)
