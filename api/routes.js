import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import express from 'express'
import path from 'path'
import keystone from 'keystone'
import jwt from 'express-jwt'
import { apolloUploadExpress } from 'apollo-upload-server'
import get from 'lodash.get'
import schema from './schema/index.js'
import cors from 'cors'

const PostComment = keystone.list('PostComment')
const Post = keystone.list('Post')
const User = keystone.list('User')
const Document = keystone.list('Document')

const prod = process.env.NODE_ENV === 'production'

// Setup Route Bindings
exports = module.exports = function (app) {
  app.use(cors())
  app.use('/documents', express.static(path.join(__dirname, 'public/uploads/documents')))
  app.use('/api',
  jwt({secret: process.env.JWT_SALT}),
  (error, request, response, next) => {
    if (error) {
      console.log(error.name, error.message)
    } else if (request.user) {
      console.log('viewing as', request.user._doc)
    }
    next()
  },
  apolloUploadExpress(),
  graphqlExpress(request => {
    return {
      schema,
      formatError: error => {
        console.log(error)
      },
      context: {
        PostComment,
        Post,
        User,
        Document,
        request,
        viewer: get(request, 'user._doc')
      }
    }
  }))
  if (!prod) {
    app.use('/', graphiqlExpress({
      endpointURL: '/api'
    }))
  }
}
