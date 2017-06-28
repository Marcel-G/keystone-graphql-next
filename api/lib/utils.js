import { buildError } from './validation'

export const protectedLimit = limit =>
  (typeof limit === 'undefined' || limit < 1 || limit > 10) ? 10 : limit

export const updateModel = (model, data) => {
  const updateFieldsString = Object.keys(data).reduce((string, key) => `${string}, ${key}`)
  const updater = model.getUpdateHandler()
  return new Promise((resolve, reject) => {
    updater.process(data, { fields: updateFieldsString }, function (err, data) {
      if (err) {
        const {error, detail} = err
        switch (error) {
          case 'validation errors':
            const validationErrors = Object.keys(detail)
              .map(key => buildError(key, detail[key].error))
            reject(validationErrors)
            break
          case 'database error':
            if (detail.message.match('E11000')) {
              reject([buildError('email', 'User already registered with email')])
            }
            break
          default:
            reject([buildError('', 'Unknown error')])
            throw new Error(err)
        }
      }
      resolve(data)
    })
  })
}
