import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/actions/authActions'

const Navbar = () => {
  const dispatch = useDispatch()

  const auth = useSelector(state => state.auth)

  const onLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <a className='navbar-brand' href='#'>Arti</a>
      <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ml-auto'>
          {/* AUTH LINKS */}
          {auth.isAuthenticated && <li className='nav-item'><Link to='/profile' className='nav-link' href='#'>Profile</Link></li>}
          {auth.isAuthenticated && <li className='nav-item'><Link to='/receipt' className='nav-link' href='#'>New Receipt</Link></li>}
          {auth.isAuthenticated && <li className='nav-item'><Link to='/' onClick={onLogout} className='nav-link' href='#'>Logout</Link></li>}
          {/* GUEST LINKS */}
          {!auth.isAuthenticated &&  <li className='nav-item'><Link to='/login' className='nav-link' href='#'>Login</Link></li>}
          {!auth.isAuthenticated && <li className='nav-item'><Link to='/signup' className='nav-link' href='#'>Signup</Link></li>}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
