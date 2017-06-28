import React, { PropTypes } from 'react'
import { filter } from 'graphql-anywhere'
import { gql, graphql } from 'react-apollo'
import PostItem from './post-item'


const PostList = ({ data: { posts, loading } }) => {
  if (posts && posts.length) {
    return (
      <section>
        <div className={'post-list'}>
          {posts.map((post, index) =>
            <PostItem
              key={index}
              entry={filter(PostItem.fragments.entry, post)} />
          )}
        </div>
        <style jsx>{`
          .post-list > ul {
            padding: 0;
          }
        `}</style>
      </section>
    )
  }
  return <div>Loading</div>
}

const posts = gql`
  query {
    posts {
      ...PostItem
    }
  }
  ${PostItem.fragments.entry}
`

PostList.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.array,
    loading: PropTypes.bool
  })
}

export default graphql(posts, {})(PostList)
