import React, { useState, useEffect } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const ConfirmModal = ({
  opened,
  closeModal,
  onConfirm,
  data,
  title
}) => {
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const responseRedux = useSelector(state => state.response) 

  useEffect(() => {
    // If there are any errors in redux set them to the input field
    responseRedux.errors && setErrors(responseRedux.errors)
    // Change status of loadin to true when first submitted then to false when server has responded
    setLoading(responseRedux.loading)
    // If response status and message are positive, object is created successfully and modal is open, close the modal
    if ((responseRedux.status === 200 || responseRedux.status === 201) &&
        responseRedux.message.length > 0 &&
        opened) {
      closeModal('confirmModal')
      setErrors({})
    }
  }, [responseRedux])

  return (
    <Modal
      isOpen={opened}
      toggle={() => closeModal('confirmModal')}
      size='md'
    >
      <ModalBody>
        <p className='text-center'>Are you sure you want to delete {title}?</p>
        <div className='row'>
          <div className='col-12'>
            {data()}
          </div>
        </div>
        <div className='text-center pt-3'>
          {/* If there is a loading bool, disable the input field and the button
          Instead show only the loader icon */}
          <button
            onClick={loading ? null : onConfirm}
            className={`btn btn-danger button ${loading ? 'disabled' : ''}`}
          >
            {loading ? <div className='loaderButton' /> : 'Delete'}
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ConfirmModal
