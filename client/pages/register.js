import React from 'react'
import { compose } from '../utils/function'
import publicPage from '../hoc/public-page'
import withData from '../hoc/with-data'
import App from '../components/app'
import RegisterForm from '../components/register-form'
import InfoBox from '../components/info-box'
import Page from '../components/page'

const RegisterPage = props => (
  <App>
    <Page>
      <h1>Register</h1>
      <RegisterForm />
    </Page>
  </App>
)

export default compose(
  publicPage,
  withData
)(RegisterPage)
