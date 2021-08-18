const timeFormat = value => {
  const birthdayObject = new Date(value)
  const birthdayString =
    birthdayObject.getFullYear() +
    '-' +
    ('0' + (birthdayObject.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + birthdayObject.getDate()).slice(-2)
  return birthdayString
}

export default timeFormat
