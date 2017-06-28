import React from 'react'
import { compose } from '../utils/function'
import withData from '../hoc/with-data'
import privatePage from '../hoc/private-page'
import App from '../components/app'
import CreatePost from '../components/create-post'
import InfoBox from '../components/info-box'
import Page from '../components/page'
import Layout from '../components/layout'

const CreatePostPage = props => (
  <App>
    <Page>
      <h1>Create Post</h1>
      <CreatePost />
    </Page>
  </App>
)

export default compose(
  privatePage,
  withData
)(CreatePostPage)
