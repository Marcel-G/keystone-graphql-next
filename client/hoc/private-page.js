import { compose } from '../utils/function'

import PageDecoratorInvariant from 'next-page-decorator-invariant'
import DemandLoggedin from './demand-loggedin'
import UserContext from './user-context'

const PrivatePage = compose(
  PageDecoratorInvariant('PrivatePage'),
  UserContext,
  DemandLoggedin
)

export default PrivatePage
