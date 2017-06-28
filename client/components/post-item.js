import React, { PropTypes } from 'react'
import { propType as qlPropType } from 'graphql-anywhere'
import { gql } from 'react-apollo'

const PostItem = ({
    entry: {
      key,
      title,
      content,
      author
    }
}) =>
    <div>
        <article>
          <a href={`/post/${key}`}>
            <h2 className={'title'}>
                {title}
            </h2>
            <div className={'author'}>
              <span>By {author.name.full}</span>
            </div>
            <p className={'description'}>
                {content}
            </p>
          </a>
        </article>
        <style jsx>{`
            article {
                display: flex;
                flex-direction: column;
                padding: 1em 0;
                border-top: 1px solid #000;
                margin-bottom: 1em;
            }
            article a {
              text-decoration: inherit;
            }
            .author {
                flex: 0 0;
                white-space: nowrap;
                margin-bottom: 1em;
            }
            .title {
                font-weight: bold;
                font-size: 110%;
            }
            .description {
                margin-top: 0.5em;
                font-size: 90%;
            }
        `}</style>
    </div>

PostItem.fragments = {
  entry: gql`
    fragment PostItem on Post {
      key
      title
      content
      author {
        name {
          full
        }
      }
    }
  `
}

PostItem.propTypes = {
  entry: qlPropType(PostItem.fragments.entry).isRequired
}

PostItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.object
}

export default PostItem
