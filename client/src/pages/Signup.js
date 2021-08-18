import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signupUser } from '../redux/actions/authActions'

import TextInput from '../components/builtin/TextInput'

const Login = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
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
    if (name && email && password && password2) {
      dispatch(signupUser({ name, email, password, password2 }))
    }
  }

  return (
    <div className='container'>
      <form className='signup' onSubmit={onSubmit}>
        <h3 className='text-center'>Signup</h3>
        <div className='form-group'>
          <label>Name</label>
          <TextInput
            name='name'
            type='name'
            className='form-control'
            id='InputEmail'
            onChange={e => setName(e.target.value)}
            value={name}
            error={errors.name}
          />
        </div>
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
        <div className='form-group'>
          <label>Confirm Password</label>
          <TextInput
            name='password2'
            type='password'
            className='form-control'
            id='InputPassword'
            onChange={e => setPassword2(e.target.value)}
            value={password2}
            error={errors.password2}
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
