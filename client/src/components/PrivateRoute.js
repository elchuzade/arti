import  React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = (props) => {
  const auth = useSelector(state => state.auth)

  if (auth.isAuthenticated && !auth.loadingAuth) {
    return <Route path={props.path} exact={props.exact} component={props.component} />
  } else if (!auth.isAuthenticated && !auth.loadingAuth) {
    return <Redirect to='/login' />
  }
  return false
}

export default PrivateRoute