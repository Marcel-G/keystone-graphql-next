import React, { PropTypes, Component } from 'react'
import { compose } from '../utils/function'
import withData from '../hoc/with-data'
import publicPage from '../hoc/public-page'
import App from '../components/app'
import Page from '../components/page'
import { PostWithData } from '../components/post'

class PostPage extends Component {
  static getInitialProps ({ query: { id } }) {
    return { postKey: id }
  }

  render () {
    return (
      <App>
        <Page>
          <PostWithData postKey={this.props.postKey} />
        </Page>
      </App>)
  }
}

PostPage.propTypes = {
  postKey: PropTypes.string
}

export default compose(
  publicPage,
  withData
)(PostPage)
