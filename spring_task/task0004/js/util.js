function addClass(element, newClassName) {
  if (!hasClass(element, newClassName)) {
    element.className = element.className ? [element.className, newClassName].join(' ') : newClassName
  }
}

function hasClass(element, className) {
  var classNames = element.className
  if (!classNames) {
    return false
  }
  
  classNames = classNames.split(/\s+/)
  for (var i = 0, len = classNames.length; i < len; i++) {
    if (classNames[i] === className) {
        return true
    }
  }
  return false
}