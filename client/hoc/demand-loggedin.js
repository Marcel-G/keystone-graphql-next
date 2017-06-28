import React, { Component } from 'react'
import PropTypes from 'prop-types'

const DemandLoggedin = Page => {
  return class DemandLoggedinWrapper extends Component {
    static async getInitialProps (pageContext) {
      const {
        user
      } = pageContext

      if (!user.loggedin) {
        if (process.browser) {
          window.location = `/login`
          return { isRedirecting: true }
        } else {
          return
        }
      }

      const pageProps = Page.getInitialProps
        ? await Page.getInitialProps({ ...pageContext, user })
        : {}

      return {
        ...pageProps,
        user
      }
    }

    constructor (props) {
      super(props)
      if (process.browser) {
        if (!props.user.loggedin && !props.isRedirecting) {
          window.location = `/login`
        }
      }
    }

    render () {
      if (this.props.user.loggedin) {
        return <Page {...this.props} />
      }

      return null
    }
  }
}

export default DemandLoggedin
