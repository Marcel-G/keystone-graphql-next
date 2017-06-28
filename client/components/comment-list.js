import React, { PropTypes } from 'react'
import { propType as qlPropType, filter } from 'graphql-anywhere'
import { gql } from 'react-apollo'
import Comment from './comment'

const CommentList = ({
  entry: {
    comments
  } }) => (
      <section>
          {comments && !!comments.length &&
            <div className={'post-list'}>
              {comments.map((comment, index) =>
                <Comment
                  key={index}
                  entry={filter(Comment.fragments.entry, comment)} />
              )}
          </div>}
        <style jsx>{`
          .post-list > ul {
            padding: 0;
          }
          .post-list {
            margin-top: 2em;
            padding-top: 2em;
            border-top: 1px solid #000;
          }
        `}</style>
      </section>
    )

CommentList.fragments = {
  entry: gql`
    fragment CommentList on Post {
      comments {
        ...Comment
      }
    }
   ${Comment.fragments.entry}
  `
}

CommentList.propTypes = {
  entry: qlPropType(CommentList.fragments.entry).isRequired
}

CommentList.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.array,
    loading: PropTypes.bool
  })
}

export default CommentList
