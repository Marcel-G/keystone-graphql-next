import { makeExecutableSchema } from 'graphql-tools'

import {
  rootSchema as userRootSchema,
  rootResolvers as userRootResolvers,
  schema as userSchema,
  resolvers as userResolvers
} from './user'

import {
  rootSchema as postRootSchema,
  rootResolvers as postRootResolvers,
  schema as postSchema,
  resolvers as postResolvers
} from './post'

import {
  rootSchema as postCommentRootSchema,
  rootResolvers as postCommentRootResolvers,
  schema as postCommentSchema,
  resolvers as postCommentResolvers
} from './post-comment'

import {schema as customTypeSchema} from './custom-types'

const rootSchema = [`
  type Query {
    ${userRootSchema.Query}
    ${postRootSchema.Query}
    ${postCommentRootSchema.Query}
  }

  type Mutation {
    ${userRootSchema.Mutation}
    ${postRootSchema.Mutation}
    ${postCommentRootSchema.Mutation}
  }

  schema {
    query: Query
    mutation: Mutation
  }
`]

const rootResolvers = {
  Query: {
    ...userRootResolvers.Query,
    ...postRootResolvers.Query,
    ...postCommentRootResolvers.Query
  },
  Mutation: {
    ...userRootResolvers.Mutation,
    ...postRootResolvers.Mutation,
    ...postCommentRootResolvers.Mutation
  }
}

const schema = [
  ...rootSchema,
  ...postCommentSchema,
  ...postSchema,
  ...userSchema,
  ...customTypeSchema
]

const resolvers = {
  ...rootResolvers,
  ...postCommentResolvers,
  ...postResolvers,
  ...userResolvers
}

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers
})
