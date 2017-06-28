import keystone from 'keystone'
import { updateModel } from './utils'

const Document = keystone.list('Document')

export const uploadDocument = documentFile =>
  new Promise((resolve, reject) => {
    const document = new Document.model()
    Document.fields.file.updateItem(
      document,
      { file: 'upload:file' },
      { file: documentFile },
      error => {
        if (error) {
          console.log(error)
          reject({ error })
        }
        resolve(document)
      }
    )
  }).then(document => document.save())
