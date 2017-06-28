import { compose } from '../utils/function'

import PageDecoratorInvariant from 'next-page-decorator-invariant'
import UserContext from './user-context'

const PublicPage = compose(
  PageDecoratorInvariant('PublicPage'),
  UserContext
)

export default PublicPage
