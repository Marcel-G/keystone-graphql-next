export const schema = [`
  # Keystone name field
  type KeystoneName {
    first: String
    last: String
    full: String
  }

  input KeystoneNameIn {
    first: String
    last: String
    full: String
  }

  enum KeystonePostState {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type FieldError {
    field: String!
    message: String!
  }

  input File {
    name: String!
    mimetype: String!
    size: Int!
    path: String!
  }

  type DocumentFile {
    filename: String!
    size: Int!
    mimetype: String!
  }

  type Document {
    url: String!
    originalname: String!
  }
`]
