import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, updateProfile, deleteProfile } from '../redux/actions/profileActions'

import TextInput from '../components/builtin/TextInput'
import ConfirmModal from '../components/ConfirmModal'

const Profile = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('Your Name')
  const [showNameInput, setShowNameInput] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const profileRedux = useSelector(state => state.profile)

  useEffect(() => {
    dispatch(getProfile())
  }, [])

  useEffect(() => {
    if (profileRedux.profile.name) {
      setName(profileRedux.profile.name)
    }
  }, [profileRedux.profile])

  const onClickEditName = () => {
    setShowNameInput(true)
  }

  const onClickSaveName = () => {
    setShowNameInput(false)
    if (name !== profileRedux.profile.name) {
      dispatch(updateProfile({ name }))
    }
  }

  const onClickDeleteName = () => {
    dispatch(deleteProfile())
  }

  const DeleteProfileComponent = () => (
    <div className='text-center'>
      <b>{name}</b>
    </div>
  )

  return (
    <div>
      <div className='container pt-5'>
        {showNameInput ?
          <div className='row mb-5'>
            <div className='col-4'>
              <TextInput
                name='name'
                value={name}
                extraClass='form-control-sm'
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className='col-2'>
              <button className='btn btn-sm btn-outline-success text-dark' onClick={onClickSaveName}>Save</button>
            </div>
          </div> :
          <div className='row mb-5'>
            <div className='col-4'>
              <span><b>{name}</b></span>
            </div>
            <div className='col-2'>
              <button className='btn btn-sm btn-outline-secondary mr-2' onClick={onClickEditName}><i className='fas fa-pencil-alt'></i></button>
              <button className='btn btn-sm btn-outline-danger' onClick={() => setShowDeleteModal(true)}><i className='fas fa-trash'></i></button>
            </div>
          </div>
        }
      </div>
      <ConfirmModal
        opened={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        onConfirm={onClickDeleteName}
        data={DeleteProfileComponent}
        title='Profile'
      />
    </div>
  )
}

export default Profile
