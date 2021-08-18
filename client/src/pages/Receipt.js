import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

const Receipt = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <label for="cameraFileInput">
        <span class="btn">Open camera</span>

        <input
          id="cameraFileInput"
          type="file"
          accept="image/*"
          capture="environment"
        />
      </label>
    </div>
  )
}

export default Receipt
