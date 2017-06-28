import keystone from 'keystone'
import jwt from 'jsonwebtoken'
const { Field: { Types } } = keystone

const User = new keystone.List('User', {
  // nodelete prevents people deleting the demo admin user
  nodelete: true
})

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
  password: { type: Types.Password, initial: true, required: false }
}, 'Permissions', {
  isProtected: { type: Boolean, noedit: true },
  userLevel: { type: Types.Select, options: 'USER, MODERATOR, ADMIN', default: 'USER', initial: true }

})

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
  return this.userLevel === 'ADMIN'
})

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' })

User.relationship({ path: 'comments', ref: 'PostComment', refPath: 'author' })

User.schema.methods.wasActive = function () {
  this.lastActiveOn = new Date()
  return this
}

User.schema.methods.signToken = function () {
  return new Promise((resolve, reject) => {
    jwt.sign(this, process.env.JWT_SALT, null, (error, token) => {
      error && reject(error)
      resolve(token)
    })
  })
}

User.schema.methods.login = async function (password) {
  const match = await new Promise((resolve, reject) => {
    this._.password.compare(password, (error, isMatch) => {
      if (error) reject(error)
      resolve(isMatch)
    })
  })
  if (!match) return false
  return await this.signToken()
}

/**
 * DEMO USER PROTECTION
 * The following code prevents anyone updating the default admin user
 * and breaking access to the demo
 */

function protect (path) {
  User.schema.path(path).set(function (value) {
    return (this.isProtected && this.get(path)) ? this.get(path) : value
  })
}

['name.first', 'name.last', 'email', 'isProtected'].forEach(protect)

User.schema.path('password').set(function (newValue) {
  // the setter for the password field is more complicated because it has to
  // emulate the setter on the password type, and ensure hashing before save
  // also, we can't currently escape the hash->set loop, so the hash is harcoded
  // for the demo user for now.
  if (this.isProtected) return process.env.PAS_SALT
  this.__password_needs_hashing = true
  return newValue
})

/**
 * END DEMO USER PROTECTION
 */

User.track = true
User.defaultColumns = 'email, userLevel'
User.register()

export default User
