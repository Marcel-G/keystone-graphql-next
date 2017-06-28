import { buildError } from './validation'

const notLoggedin = 'Must be logged in to complete this action'
const notPermittedError = 'You do not have permission to perform this action'

export const authError = message => buildError('auth', message)

export const demandValidViewer = viewer => {
  if (!viewer || !viewer._id) authError(notLoggedin)
}

export const viewerMustBeLevel = (viewer, userLevel) => {
  const viewerError = demandValidViewer(viewer)
  if (viewerError) return viewerError
  if (!testUserLevel(viewer, userLevel)) return authError(notPermittedError)
}

export const accessLevel = (func, level) =>
  (root, params, context) => {
    const authError = viewerMustBeLevel(context.viewer, level)
    if (authError) throw new Error(authError.message)
    return func(root, params, context)
  }

export const mustBeOwner = (viewer, userRef) => {
  if (!(isOwner(viewer, userRef) || isAdmin(viewer))) return authError(notPermittedError)
}

const testUserLevel = (viewer, levels) => {
  if (!viewer) return false
  if (typeof levels === 'string') {
    return viewer.userLevel === levels
  } else if (levels.length) {
    return levels.some(level => viewer.userLevel)
  } else {
    throw new Error('Implementation error')
  }
}

export const isOwner = (viewer, userRef) => (viewer && userRef && userRef.equals(viewer._id))

export const isAdmin = viewer => testUserLevel(viewer, 'ADMIN')

export const isModerator = viewer => testUserLevel(viewer, ['ADMIN', 'MODERATOR'])

export const isUser = viewer => testUserLevel(viewer, ['ADMIN', 'MODERATOR', 'USER'])
