import keystone from 'keystone'
const { Field: { Types } } = keystone

const Post = new keystone.List('Post', {
  autokey: { from: 'title', path: 'key', unique: true }
})

Post.add({
  title: { type: String, initial: true, required: true },
  state: { type: Types.Select, options: 'DRAFT, PUBLISHED, ARCHIVED, DELETED', default: 'DRAFT', index: true },
  author: { type: Types.Relationship, ref: 'User', initial: true, required: true, index: true },
  publishedDate: { type: Types.Date, index: true },
  documents: { type: Types.Relationship, many: true, ref: 'Document' },
  content: { type: Types.Textarea }
})

Post.schema.virtual('content.full').get(function () {
  return this.content.extended || this.content.brief
})

Post.relationship({ path: 'comments', ref: 'PostComment', refPath: 'post' })
Post.relationship({ path: 'documents', ref: 'Documents', refPath: 'post' })

Post.track = true
Post.defaultColumns = 'title, state, author, publishedDate'
Post.register()

export default Post
