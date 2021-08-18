import React, { useState, useEffect } from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import store from './store'
import { useDispatch, useSelector } from 'react-redux'
import './assets/styles/App.scss'
import 'react-toastify/dist/ReactToastify.css'

import { stopLoadingAuth, setCurrentUser } from './redux/actions/commonActions'
import { logoutUser } from './redux/actions/authActions'
import { ToastContainer } from 'react-toastify'

import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Receipt from './pages/Receipt'

const checkToken = () => {
  if (localStorage.jwtToken) {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken)
    // Decode Token and get user info and expiration
    const decoded = jwt_decode(localStorage.jwtToken)
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded))
    if (decoded.profile) {
      return true
    }
    // Check for expired token
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser())
      // Redirect to login
      window.location.href = '/login'
    }
  }
  return false
}

function App() {
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const auth = useSelector(state => state.auth)
  
  useEffect(() => {
    if (auth.isAuthenticated !== isAuthenticated) {
      setIsAuthenticated(auth.isAuthenticated)
    }
  }, [auth])

  useEffect(() => {
    setIsAuthenticated(checkToken())
    dispatch(stopLoadingAuth())
  }, [])

  return (
      <div className='App'>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <PrivateRoute exact path='/receipt' component={Receipt} />
          {/* <PrivateRoute exact path='/games/:id' component={({ match }) => (<Game id={match.params.id} />)} /> */}
          <Route path='*' component={NotFound} />
        </Switch>
        <ToastContainer />
      </div>
  )
}

export default withRouter(App)
