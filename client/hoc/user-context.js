import React, { Component } from 'react'
import cookies from 'next-cookies'
import PropTypes from 'prop-types'

const UserContext = Page => {
  return class UserContextWrapper extends Component {
    static async getInitialProps (pageContext) {
      const { token } = cookies(pageContext)
      const user = { token, loggedin: !!token }
      const pageProps = Page.getInitialProps
        ? await Page.getInitialProps({ ...pageContext, user })
        : {}

      return { ...pageProps, user }
    }

    render () {
      return <Page {...this.props} />
    }
  }
}

export default UserContext
