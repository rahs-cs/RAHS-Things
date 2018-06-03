window.strToDom = function strToDom (str) {
  return new DOMParser().parseFromString(str, 'text/html').body.childNodes[0]
}
