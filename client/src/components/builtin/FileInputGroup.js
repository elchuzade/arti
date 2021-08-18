import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const FileInputGroup = ({
  name,
  placeholder,
  label,
  error,
  info,
  prepend,
  append,
  extraClass,
  onChange,
  sendFile,
  accept,
  disabled,
  coverClassInfo
}) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <div className='input-group'>
        <div className='input-group-prepend'>{prepend}</div>
        <div className={`custom-file ${extraClass}`}>
          <input
            type='file'
            className={classnames(
              `custom-file-input form-control`,
              {
                'is-invalid': error
              }
            )}
            onChange={onChange}
            accept={accept}
            disabled={disabled}
          />
          <label className='custom-file-label'>
            {sendFile && sendFile.name ? sendFile.name.substring(0,16) + '...' : placeholder}
          </label>
        </div>
        <div className='input-group-append'>{append}</div>
      </div>
      {error && <div className='feedback-invalid'>{error}</div>}
      {info && <small className={`form-text text-muted ${coverClassInfo}`}>{info}</small>}
    </div>
  )
}

FileInputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string,
  prepend: PropTypes.object,
  append: PropTypes.object,
  extraClass: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  sendFile: PropTypes.object,
  accept: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  coverClassInfo: PropTypes.string
}

FileInputGroup.defaultProps = {
  accept: '*',
  disabled: false
}

export default FileInputGroup
