window.onload = function () {
  var hobby = $('#hobby')
  var showArea = $('#showArea')
  var dataList = []

  // 1.第一阶段
  /*
  $.click('#save', function (ev) {
    dataList.length = 0
    var txtList = hobby.value.split(',')
    each(txtList, function (val) {
      dataList.push(trim(val))
    })
    dataList = uniqArray(dataList)
    htmlString = ''
    each(dataList, function (val) {
      htmlString += val + '<br>'
    })
    showArea.innerHTML = htmlString
  })
  */

  // 2.第二阶段
  // \u3000全角空格 \u0020半角空格，\uff0c全角逗号 \u002c半角逗号
  // \u3001顿号 \uff1b全角分号
  // 或者直接用符号吧
  // s.charCodeAt(0).toString(16)
  /*
  var seperator = /[\u3000\u0020\uff0c\u002c\u3001\uff1b\n]/g
  $.click('#save', function (ev) {
    dataList.length = 0
    var txtList = hobby.value.replace(seperator, ';').split(';')
    each(txtList, function (val) {
      dataList.push(trim(val))
    })
    dataList = uniqArray(dataList)
    htmlString = ''
    each(dataList, function (val) {
      htmlString += val + '<br>'
    })
    showArea.innerHTML = htmlString
  })
  */

  // 3.第三阶段
  var seperator = /[\u3000\u0020\uff0c\u002c\u3001\uff1b\n]/g
  var warn = $('#warn')
  $.click('#save', function (ev) {
    var hobbies = getHobbies()
    if (hobbies.length > 10) {
      return
    }
    showArea.innerHTML = ''
    each(hobbies, function (val) {
      var label = document.createElement('label')
      var input = document.createElement('input')
      label.setAttribute('for', val)
      label.innerText = val
      input.setAttribute('type', 'checkbox')
      input.setAttribute('name', val)
      showArea.appendChild(label)
      showArea.appendChild(input)
    })
  })

  $.on('#hobby', 'keyup', function (ev) {
    var hobbies = getHobbies()
    if (hobbies.length > 10) {
      // removeClass(warn, 'success')
      // addClass(warn, 'warn')
      // warn.style.display = 'block'
      warn.style.cssText = 'display: block; color: red;'
      warn.innerText = '警告，警告，兴趣爱好不能超出10项'
    } else if (warn.style.display === 'block') {
      // removeClass(warn, 'warn')
      // addClass(warn, 'success')
      warn.style.color = 'green'
      warn.innerText = '输入符合规范'
      setTimeout(function () {
        warn.style.display = 'none'
      }, 3000)
    }
  })

  function getHobbies() {
    var hobbies = deleteBlank(hobby.value.replace(seperator, ';').split(';'))
    return uniqArray(hobbies)
  }
}
