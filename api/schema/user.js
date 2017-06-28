import {
  updateModel,
  buildError,
  requiredFields,
  accessLevel
} from '../lib'

export const rootSchema = {
  Query: `
    users: [User!]
    user: User!
    me: User
  `,
  Mutation: `
    login (
      email: String!
      password: String!
    ) : UserLogin
    register (
      name: KeystoneNameIn!
      email: String!
      password: String!
    ) : UserLogin
  `
}

export const rootResolvers = {
  Query: {
    users: accessLevel((root, {limit}, {User}) =>
      User.model.find().limit(protectedLimit(limit)),
      ['MODERATOR', 'ADMIN']),
    user: accessLevel((root, {id}, {User}) =>
      User.model.findOne({_id: id}),
      ['MODERATOR', 'ADMIN']),
    me: accessLevel((root, _, {viewer}) => viewer,
      ['USER', 'MODERATOR', 'ADMIN'])
  },
  Mutation: {
    login: async function (root, {email, password}, {User}) {
      const requiredErrors = requiredFields({email, password})
      if (requiredErrors.length) return { errors: requiredErrors }

      let validationErrors = []

      let token = null
      let user = null

      if (email && password) {
        user = await User.model.findOne({email})
        if (!user) validationErrors.push(buildError('email', 'Address not found'))
        else {
          token = await user.login(password)
          if (!token) validationErrors.push(buildError('password', 'Incorrect password'))
        }
      }

      if (validationErrors.length) return { errors: validationErrors }
      return { user, token }
    },
    register: async function (root, {name, email, password}, {User}) {
      const requiredErrors = requiredFields({email, password})
      if (requiredErrors.length) return { errors: requiredErrors }

      let data = {
        name,
        email,
        password
      }

      let newUser = new User.model(data)
      const { errors = [] } = await updateModel(newUser, { name, email, password })
        .then(data => ({ data }))
        .catch(errors => ({ errors }))

      if (errors.length) return { errors }
      return { user: newUser }
    }
  }
}

export const schema = [`
  # Website User
  type User {
    # Unique id for user
    id: String!

    # Name of user
    name: KeystoneName

    # Email address of user
    email: String

    # Posts created by user
    posts: [Post]

    # Comments written by user
    comments: [PostComment]
  }

  type UserLogin {
    token: String
    errors: [FieldError!]
    user: User
  }
`]

export const resolvers = {
  User: {
    id: ({_id}) => _id,
    posts: ({_id}, _, {Post}) => Post.model.find({author: _id}),
    comments: ({_id}, _, {PostComment}) => PostComment.model.find({author: _id}),
    email: accessLevel(({email}) => email, ['ADMIN'])
  }
}
