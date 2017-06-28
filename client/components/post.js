import React, { PropTypes } from 'react'
import { filter } from 'graphql-anywhere'
import { gql, graphql } from 'react-apollo'
import { compose } from '../utils/function'
import CommentList from './comment-list'
import CreateComment from './create-comment'
import ImageBlock from '../components/image-block'

const Post = ({ data: { post, loading }, deletePost, postKey }) => (
  <div>
    {post
      ? <div>
          <article>
            <h1 style={{ fontSize: '150%' }}>{post.title}</h1>
            <span>By {post.author.name.full}</span>
            {post.canDelete &&
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '80%'
                }}
                onClick={() => deletePost(postKey)}
              >
                Delete post
              </span>}
            <p>{post.content}</p>
          </article>
          {!!post.documents.length &&
            <aside>
              <h2>Documents ({post.documents.length})</h2>
              <ImageBlock
                images={post.documents.map(({ url }, index) => (
                  <img src={url} />
                ))}
              />
            </aside>}
          <CommentList entry={filter(CommentList.fragments.entry, post)} />
          <CreateComment postKey={postKey} />
        </div>
      : <section><h1>Post not found</h1></section>}
    <style jsx>
      {`
        span + span {
          margin-left: 1em
        }
        article {
          border-top: 3px solid #000
        }
      `}
    </style>
  </div>
)

const post = gql`
  query post($postKey: String!) {
    post(key: $postKey) {
      id
      canDelete
      author {
        name {
          full
        }
      }
      title
      content
      documents {
        url
      }
      ...CommentList
    }
  }
  ${CommentList.fragments.entry}
`

const deletePost = gql`
  mutation deletePost($postKey: String!) {
    deletePost(postKey: $postKey) {
      errors {
        field
        message
      }
    }
  }
`

Post.propTypes = {
  postKey: PropTypes.string,
  deletePost: PropTypes.func,
  data: PropTypes.shape({
    post: PropTypes.object,
    loading: PropTypes.bool
  })
}

export const PostWithData = compose(
  graphql(post, {
    options: ({ postKey }) => ({ variables: { postKey } })
  }),
  graphql(deletePost, {
    props: ({ mutate }) => ({
      deletePost: postKey =>
        mutate({
          variables: { postKey }
        })
    })
  })
)(Post)
