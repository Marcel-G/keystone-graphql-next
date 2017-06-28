import React from 'react'
import { compose } from '../utils/function'
import withData from '../hoc/with-data'
import publicPage from '../hoc/public-page'
import App from '../components/app'
import LoginForm from '../components/login-form'
import Page from '../components/page'

const LoginPage = props => (
  <App>
    <Page>
      <div>
        <h1>Login</h1>
        <p>Not a member? <a href={'/register'}>Register here.</a></p>
      </div>
      <LoginForm />
    </Page>
  </App>
)

export default compose(
  publicPage,
  withData
)(LoginPage)
