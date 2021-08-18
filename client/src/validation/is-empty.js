// Check if object or string or array is empty
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'object' && value.length != null && value.length === 0)

export default isEmpty
