import {
  protectedLimit,
  updateModel,
  buildError,
  requiredFields,
  accessLevel,
  isOwner,
  isAdmin
} from '../lib'

export const rootSchema = {
  Query: `
    comments (
      id: String!
    ) : [PostComment]
  `,
  Mutation: `
    createComment (
      postKey: String!
      content: String!
    ) : NewComment
    deleteComment (
      commentId: String!
    ) : NewComment
  `
}

export const rootResolvers = {
  Query: {
    comments: (root, { id }, { PostComment }) => PostComment.model.findById(id)
  },
  Mutation: {
    createComment: accessLevel(
      async function(
        root,
        { content, postKey },
        { Post, PostComment, viewer }
      ) {
        const requiredErrors = requiredFields({ content, postKey })
        if (requiredErrors.length) return { errors: requiredErrors }

        let validationErrors = []

        const post = await Post.model.findOne({ key: postKey })
        if (!post)
          validationErrors.push(buildError('postKey', 'Cannot find post'))
        if (validationErrors.length) return { errors: validationErrors }

        let data = {
          content,
          post: post._id,
          author: viewer._id
        }

        let newComment = new PostComment.model(data)
        const { errors = [] } = await updateModel(newComment, data)
          .then(data => ({ data }))
          .catch(errors => ({ errors }))

        if (errors.length) return { errors }
        return { comment: newComment }
      },
      ['USER', 'MODERATOR', 'ADMIN']
    ),
    deleteComment: accessLevel(
      async function(root, { commentId }, { PostComment, viewer }) {
        const requiredErrors = requiredFields({ commentId })
        if (requiredErrors.length) return { errors: requiredErrors }

        let validationErrors = []

        const comment = await PostComment.model.findById(commentId)

        if (!comment)
          validationErrors.push(
            buildError('commentId', 'Comment could not be found')
          )
        if (!(isOwner(viewer, comment.author) || isAdmin(viewer)))
          validationErrors.push(
            buildError(
              'viewer',
              'You do not have permission to perform this action'
            )
          )
        if (validationErrors.length) return { errors }

        const data = { commentState: 'DELETED' }
        const { errors = [] } = await updateModel(comment, data)
          .then(data => ({ data }))
          .catch(errors => ({ errors }))

        if (errors.length) return { errors }
        return {}
      },
      ['USER', 'MODERATOR', 'ADMIN']
    )
  }
}

export const schema = [
  `
  # Comments left on posts
  type PostComment {
    # Unique identifier of comment
    id: String!

    # Content of comment
    content: String

    # State of comment
    commentState: KeystonePostState!

    # User that wrote the comment
    author: User

    # Does the current viewer have permission to delete comment
    canDelete: Boolean!

    # Post the comment relates to
    post: Post
  }

  type NewComment {
    errors: [FieldError!]
    comment: PostComment
  }
`
]

export const resolvers = {
  PostComment: {
    id: ({ _id }) => _id,
    canDelete: ({ author }, _, { viewer = false }) =>
      (isOwner(viewer, author) || isAdmin(viewer)),
    post: ({ post }, _, { Post }) => Post.model.findOne({ _id: post }),
    author: ({ author }, _, { User }) => User.model.findOne({ _id: author })
  }
}
