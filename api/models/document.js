import keystone from 'keystone'
const { Field: { Types } } = keystone

const Document = new keystone.List('Document')

const myStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: keystone.expandPath('./public/uploads/documents/'),
        publicPath: 'http://localhost:3001/documents/'
    },
    schema: {
      size: true,
      mimetype: true,
      path: true,
      originalname: true,
      url: true
    }
})

Document.add({
  name: { type: Types.Key, index: true},
  file: {
    type: Types.File,
    storage: myStorage
	},
  url: {type: String},
  fileType: {type: String}
})


Document.defaultColumns = '_id'
Document.register()

export default Document
