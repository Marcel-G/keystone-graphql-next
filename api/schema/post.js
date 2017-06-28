import {
  protectedLimit,
  updateModel,
  buildError,
  authError,
  requiredFields,
  accessLevel,
  isOwner,
  isAdmin
} from '../lib'
import { uploadDocument } from '../lib'

export const rootSchema = {
  Query: `
    posts: [Post!]
    post (
      key: String!
    ) : Post
  `,
  Mutation: `
    createPost (
      title: String!
      content: String!
      documents: [File]
    ) : newPost
    deletePost (
      postKey: String!
    ) : newPost
  `
}

export const rootResolvers = {
  Query: {
    posts: (root, { limit }, { Post }) =>
      Post.model.find({ state: 'PUBLISHED' }).limit(protectedLimit(limit)),
    post: (root, { key }, { Post }) =>
      Post.model.findOne({ key, state: 'PUBLISHED' })
  },
  Mutation: {
    createPost: accessLevel(
      async function(root, { content, title, documents }, { Post, User, viewer }) {
        const requiredErrors = requiredFields({ content, title })
        if (requiredErrors.length) return { errors: requiredErrors }

        let linkedDocuments
        if (documents && documents.length) {
          linkedDocuments = await Promise.all(documents.map(uploadDocument))
        }
        let newPost
        let data = {
          title,
          content,
          state: 'PUBLISHED',
          author: viewer._id,
          documents: linkedDocuments && linkedDocuments.map(({_id}) => ({_id}))
        }
        newPost = new Post.model(data)
        const { errors = [] } = await updateModel(newPost, data)
          .then(data => ({ data }))
          .catch(errors => ({ errors }))

        if (errors.length) return { errors }
        return { post: newPost }
      },
      ['USER', 'MODERATOR', 'ADMIN']
    ),
    deletePost: accessLevel(
      async function(root, { postKey }, { Post, viewer }) {
        const requiredErrors = requiredFields({ postKey })
        if (requiredErrors.length) return { errors: requiredErrors }

        let validationErrors = []

        const post = await Post.model.findOne({ key: postKey })

        if (!post) validationErrors.push(buildError('postKey', 'Post could not be found'))
        if (!(isOwner(viewer, post.author) || isAdmin(viewer))) {
          validationErrors.push(authError('You do not have permission to perform this action'))
        }
        if (validationErrors.length) return { errors }

        const data = { state: 'DELETED' }
        const { errors = [] } = await updateModel(post, data)
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
  # Trader information
  type Post {
    # Unique id for post
    id: String!

    # Unique key for post
    key: String!

    # Display title for post
    title: String

    # Content of the post
    content: String

    # Does the current viewer have permission to delete post
    canDelete: Boolean!

    # Date when transaction was last updated
    state: KeystonePostState!

    # User that created the post
    author: User

    # Comments left on post
    comments: [PostComment]

    # Documents linked to post
    documents: [Document]
  }

  type newPost {
    errors: [FieldError!]
    post: Post
  }
`
]

export const resolvers = {
  Post: {
    id: ({ _id }) => _id,
    canDelete: ({ author }, _, { viewer = false }) =>
      isOwner(viewer, author) || isAdmin(viewer),
    author: ({ author }, _, { User }) => User.model.findOne({ _id: author }),
    comments: ({ _id }, _, { PostComment }) =>
      PostComment.model.find({ post: _id, commentState: 'PUBLISHED' }),
    documents: ({ documents }, _, { Document }) =>
      documents.map(document =>
        Document.model.findOne({ _id: document})
        .then(({file: { url, originalname }}) => ({url, originalname}))
      )
  }
}
