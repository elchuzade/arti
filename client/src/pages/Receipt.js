import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Input, Container } from 'reactstrap'
import { uploadIcon } from '../redux/actions/receiptActions'

const Receipt = () => {
  const dispatch = useDispatch()
  const [icon, setIcon] = useState(null)
  const [receipt, setReceipt] = useState(null)

  const receiptReducer = useSelector(state => state.receipt)

  useEffect(() => {
    if (receiptReducer.receipt.user) {
      setReceipt(receiptReducer.receipt)
      console.log(receiptReducer.receipt)
    }
  }, [receiptReducer])

  const onUploadImage = () => {
    if (icon.name) {
      const formData = new FormData()
      formData.append('receiptImage', icon)
      dispatch(uploadIcon(formData))
    }
  }

  return (
    <div>
      <Container className='text-center pt-5'>
        <Row className='mb-2'>
          <Col>
            <label htmlFor='cameraFileInput'>
              <span className="btn btn-success">Open camera</span>
              <Input
                id="cameraFileInput"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => setIcon(e.target.files[0])}
              />
            </label>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col>
            {icon && <Button className='btn btn-success' onClick={onUploadImage}>Apply</Button>}
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col>
            {icon && <img src={URL.createObjectURL(icon)} className='img-fluid receipt-image' />}
          </Col>
        </Row>
        {receipt && (
          <div>
            <Row>
              <Col>
                {receipt.organizationName && <h4>Organization Name: {receipt.organizationName.text}</h4>}
              </Col>
              <Col>
                {receipt.taxNumber && <h4>Tax Number: {receipt.taxNumber.text}</h4>}
              </Col>
            </Row>
            <Row>
            <Col>
              {receipt.date && <h4>Date: {receipt.date.text}</h4>}
            </Col>
            <Col>
              {receipt.time && <h4>Time: {receipt.time.text}</h4>}
            </Col>
          </Row>
        </div>
        )}
      </Container>
    </div>
  )
}

export default Receipt
