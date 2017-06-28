import React from 'react'
import { compose } from '../utils/function'
import withData from '../hoc/with-data'
import publicPage from '../hoc/public-page'
import App from '../components/app'
import PostList from '../components/post-list'
import Page from '../components/page'

const HomePage = props => (
  <App>
    <Page>
      <div style={{ borderTop: '2px solid #000' }}>
        <h1>Keystone graphql nextjs</h1>
        <strong>Full stack node with NextJs front-end & KeystoneJs backend over GraphQL.</strong>
        <h2>Features</h2>
        <ul>
          <li>User Accounts register & login</li>
          <li>Create / delete posts</li>
          <li>Create / delete comments</li>
          <li>Document upload</li>
        </ul>
      </div>
      <h1>Posts</h1>
      <p>Create your own post <a href={'/create-post'}>here</a></p>
      <PostList />
    </Page>
  </App>
)

export default compose(
  publicPage,
  withData
)(HomePage)
