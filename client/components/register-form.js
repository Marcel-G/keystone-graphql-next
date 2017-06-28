import React, { Component, PropTypes } from 'react'
import Formsy from 'formsy-react'
import { gql, graphql } from 'react-apollo'
import { RaisedButton } from 'material-ui'
import { FormsyText } from 'formsy-material-ui/lib'
import { bindAll } from '../utils/function'

const errorMessages = {
  invalidEmail: 'Email is not valid',
  passwordMismatch: 'Passwords should match'
}

class RegisterForm extends Component {
  constructor () {
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
  submitForm = data => {
    const { register } = this.props
    const { email, first, last, password } = data
    const name = { first, last }
    register(email, name, password).then(({ data }) => {
      const { errors } = data.register
      if (errors && errors.length > 0) {
        this.form.updateInputsWithError(errors.reduce((update, { field, message }) => (
          { ...update, [field]: message }
        ), {}))
      } else {
        window.location = `/`
      }
    }).catch(error => {
      console.log(error)
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
                      floatingLabelText="First name"
                      required
                      name="first"
                      style={{
                        display: 'block',
                        width: '100%' }} />
                  <FormsyText
                      floatingLabelText="Last name"
                      required
                      name="last"
                      style={{
                        display: 'block',
                        width: '100%' }} />
                  <FormsyText
                      floatingLabelText="Email"
                      name="email"
                      required
                      validationError={errorMessages.invalidEmail}
                      validations="isEmail"
                      style={{
                        display: 'block',
                        width: '100%' }} />
                  <FormsyText
                      floatingLabelText="Password"
                      required
                      name="password"
                      style={{
                        display: 'block',
                        width: '100%' }}
                      type="password" />
                  <FormsyText
                      floatingLabelText="Password"
                      required
                      name="repeated_password"
                      validations="equalsField:password"
                      validationError={errorMessages.passwordMismatch}
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
                      label={'Register'} />
              </Formsy.Form>
          </section>
    )
  }
}

const register = gql`
  mutation register($email: String!, $name: KeystoneNameIn!, $password: String!) {
    register(email: $email, name: $name, password: $password) {
      errors {
        field
        message
      }
    }
  }
`

RegisterForm.propTypes = {
  register: PropTypes.func
}

export default graphql(register, {
  props: ({ mutate }) => ({
    register: (email, name, password) => mutate({
      variables: { email, name, password }
    })
  })
})(RegisterForm)
