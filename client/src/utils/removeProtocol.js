const removeProtocol = link => {
  return link.replace(/(^\w+:|^)\/\//, '')
}

export default removeProtocol