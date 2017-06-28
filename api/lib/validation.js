const toTitleCase = str =>
  str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

export const buildError = (field, message) => ({field, message})

export const requiredFields = fields =>
  Object.keys(fields).map(key => {
    if (!fields[key]) buildError(key, `${toTitleCase(key)} cannot be blank`)
  }).filter(error => !!error)
