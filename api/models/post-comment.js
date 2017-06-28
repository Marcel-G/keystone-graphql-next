import keystone from 'keystone'
const { Field: { Types } } = keystone

const PostComment = new keystone.List('PostComment', {
  label: 'Comments'
})

PostComment.add({
  author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
  post: { type: Types.Relationship, initial: true, ref: 'Post', index: true },
  commentState: { type: Types.Select, options: 'DRAFT, PUBLISHED, ARCHIVED, DELETED', default: 'PUBLISHED', index: true },
  publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true }
})

PostComment.add('Content', {
  content: { type: Types.Textarea }
})

PostComment.schema.pre('save', function (next) {
  this.wasNew = this.isNew
  if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState === 'PUBLISHED') {
    this.publishedOn = new Date()
  }
  next()
})

PostComment.schema.post('save', function () {
  if (!this.wasNew) return
  if (this.author) {
    keystone.list('User').model.findById(this.author).exec(function (err, user) {
      if (user) {
        user.wasActive().save()
      }
    })
  }
})

PostComment.track = true
PostComment.defaultColumns = 'author, post, publishedOn, commentState'
PostComment.register()

export default PostComment
