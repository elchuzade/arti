import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Input, Container } from 'reactstrap'
import { uploadIcon } from '../redux/actions/receiptActions'

const Receipt = () => {
  const dispatch = useDispatch()
  const [icon, setIcon] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [loadingApply, setLoadingApply] = useState(false)

  const receiptReducer = useSelector(state => state.receipt)

  useEffect(() => {
    if (receiptReducer.receipt._id) {
      setReceipt(receiptReducer.receipt)
      setLoadingApply(false)
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
  }, [receiptReducer])

  const onUploadImage = () => {
    if (icon.name) {
      const formData = new FormData()
      formData.append('receiptImage', icon)
      setLoadingApply(true)
      dispatch(uploadIcon(formData))
    }
  }

  const scrollToBottom = () =>{ 
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth'
    })
  }

  const setReceiptIcon = e => {
    setIcon(e.target.files[0])
    setTimeout(() => {
      scrollToBottom()  
    }, 300)
  }

  return (
    <div>
      <Container className='text-center pt-4'>
        {!icon && <div className='receipt-container' />}
        <Row className='mb-2'>
          <Col>
            {icon && <img src={URL.createObjectURL(icon)} className='img-fluid receipt-image' />}
          </Col>
        </Row>
        <Row className='mb-2'>
          <Col>
            {loadingApply && <button disabled className={`btn ${!icon ? 'btn-success py-2 px-5 button-main' : 'py-1 btn-secondary button-rescan px-5'}`}>{icon ? 'RESCAN' : 'SCAN'}</button>}
            <label htmlFor='cameraFileInput'>
              {!loadingApply && <span className={`btn ${!icon ? 'btn-success py-2 px-5 button-main' : 'py-1 btn-secondary button-rescan px-5'}`}>{icon ? 'RESCAN' : 'SCAN'}</span>}
              <Input
                id="cameraFileInput"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={setReceiptIcon}
              />
            </label>
          </Col>
        </Row>
        <Row className='my-5 pb-5'>
          <Col>
            {icon && <Button className='btn btn-success button-main py-3 px-5' disabled={loadingApply} onClick={onUploadImage}>{loadingApply ? <div className='loaderButton text-white' /> : 'Apply'}</Button>}
          </Col>
        </Row>
        {receipt && (
          <div className='mb-5'>
            {receipt.taxNumber && <Row>
              <Col className='col-5 text-left'>Tax No:</Col><Col className='col-7 text-left'><b>{receipt.taxNumber.text}</b></Col>
            </Row>}
            {receipt.date && <Row>
              <Col className='col-5 text-left'>Date:</Col><Col className='col-7 text-left'><b>{receipt.date.text}</b></Col>
            </Row>}
            {receipt.time && <Row>
              <Col className='col-5 text-left'>Time:</Col><Col className='col-7 text-left'><b>{receipt.time.text}</b></Col>
            </Row>}
            {receipt.receiptNumber && <Row>
              <Col className='col-5 text-left'>Receipt No:</Col><Col className='col-7 text-left'><b>{receipt.receiptNumber.text}</b></Col>
            </Row>}
            {receipt.taxAmount && <Row>
              <Col className='col-5 text-left'>Tax Amount:</Col><Col className='col-7 text-left'><b>{receipt.taxAmount.text}</b></Col>
            </Row>}
            {receipt.totalAmount && <Row>
              <Col className='col-5 text-left'>Total Amount:</Col><Col className='col-7 text-left'><b>{receipt.totalAmount.text}</b></Col>
            </Row>}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Receipt
