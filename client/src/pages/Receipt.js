import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { uploadIcon } from '../redux/actions/receiptActions'

const Receipt = () => {
  const dispatch = useDispatch()
  const [icon, setIcon] = useState(null)

  const onUploadImage = () => {
    if (icon.name) {
      const formData = new FormData()
      formData.append('receiptImage', icon)
      dispatch(uploadIcon(formData))
    }
  }

  return (
    <div>
      <label htmlFor='cameraFileInput'>
      <span className="btn">Open camera</span>
      {icon && <img src={URL.createObjectURL(icon)} />}
      <input
        id="cameraFileInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={e => setIcon(e.target.files[0])}
      />
      {icon && <button className='btn' onClick={onUploadImage}>Apply</button>}
      </label>
    </div>
  )
}

export default Receipt
