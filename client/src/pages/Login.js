import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loginUser } from '../redux/actions/authActions'

import TextInput from '../components/builtin/TextInput'

const Login = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const auth = useSelector(state => state.auth)
  const responseRedux = useSelector(state => state.response) 

  useEffect(() => {
    setErrors(responseRedux.errors)
  }, [responseRedux.errors])

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.location.href = '/'
    }
  }, [auth])

  const onSubmit = e => {
    e.preventDefault()
    if (email && password) {
      dispatch(loginUser({ email, password }))
    }
  }

  return (
    <div className='container'>
      <form className='login' onSubmit={onSubmit}>
        <h3 className='text-center'>Login</h3>
        <div className='form-group'>
          <label>Email</label>
          <TextInput
            name='email'
            type='email'
            className='form-control'
            id='InputEmail'
            onChange={e => setEmail(e.target.value)}
            value={email}
            error={errors.email}
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <TextInput
            name='password'
            type='password'
            className='form-control'
            id='InputPassword'
            onChange={e => setPassword(e.target.value)}
            value={password}
            error={errors.password}
          />
        </div>
        <div className='text-center pt-3'>
          <button type='submit' className='btn btn-info login-button'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Login
