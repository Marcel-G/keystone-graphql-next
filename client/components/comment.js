import React, { PropTypes } from 'react'
import { propType as qlPropType } from 'graphql-anywhere'
import { gql, graphql } from 'react-apollo'

const Comment = ({
  deleteComment,
  entry: {
    content,
    canDelete,
    author,
    id
  } }) => <div>
        <div>
          <span style={{ fontWeight: 'bold' }}>{author.name.full}</span>
          {canDelete &&
            <span style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '80%' }} onClick={() => deleteComment(id)}>Delete comment</span>}
          <p>{content}</p>
        </div>
        <style jsx>{`
          p {
            margin-top: .5em;
            margin-bottom: 2em;
          }
          span + span {
            margin-left: 1em;
          }
        `}</style>
      </div>

Comment.fragments = {
  entry: gql`
    fragment Comment on PostComment {
      id
      canDelete
      content
      author {
        name {
          full
        }
      }
    }
  `
}

const deleteComment = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(commentId: $commentId) {
      errors {
        field
        message
      }
    }
  }
`

Comment.propTypes = {
  entry: qlPropType(Comment.fragments.entry).isRequired,
  deleteComment: PropTypes.func
}

export default graphql(deleteComment, {
  props: ({ mutate }) => ({
    deleteComment: commentId => mutate({
      variables: { commentId },
      refetchQueries: ['post']
    })
  })
})(Comment)

