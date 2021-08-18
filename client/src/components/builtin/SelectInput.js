import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const SelectInput = ({
  name,
  value,
  label,
  error,
  info,
  onChange,
  disabled,
  options,
  extraClass
}) => {
  let selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ))
  selectOptions.unshift(
    <option key='select' value='' disabled hidden>
      Select
    </option>
  )
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className={classnames(`form-control ${extraClass}`, {
          'is-invalid': error
        })}
        name={name}
        value={value}
        placeholder='Select'
        onChange={onChange}
        disabled={disabled}
      >
        {selectOptions}
      </select>
      {error && <div className='invalid-feedback'>{error}</div>}
      {info && <small className='form-text text-muted'>{info}</small>}
    </div>
  )
}

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  info: PropTypes.string,
  options: PropTypes.array.isRequired,
  extraClass: PropTypes.string
}

export default SelectInput
