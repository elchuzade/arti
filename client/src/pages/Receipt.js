import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

const Receipt = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <input type="file" name="image" accept="image/*" capture="environment"></input>
    </div>
  )
}

export default Receipt
