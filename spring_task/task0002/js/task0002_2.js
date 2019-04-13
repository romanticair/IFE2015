window.onload = function () {
  var toTarget = [$('#toYear'), $('#toMonth'), $('#toDay')]
  var day = $('#day')
  var hour = $('#hour')
  var minute = $('#minute')
  var second = $('#second')
  var date = $('#date')
  var timerId = null
  var toDate = null
  var limit = [10000, 12, 31]

  // YYYY-MM-DD
  $.on('#date', 'keyup', function (ev) {
    var val = trim(date.value)
     // 在 '-' 除按下的 backspace，向前裁剪一位数字
    if (ev.keyCode === 8 && (val.length === 4 || val.length === 7)) {
      // 不要最后一位数字(backspace 删除)
      var dateString = val.slice(0, -1).replace(/[^\d]/g, '')
    } else {
      var dateString = val.replace(/[^\d]/g, '')
    }

    var s = ''
    if (/^\d{0,4}/.test(dateString)) {
      s = dateString.substr(0, 4)
      dateString = dateString.substr(4)
    }

    if (s.length === 4 && /^\d{0,2}/.test(dateString)) {
      s += '-' + dateString.substr(0, 2)
      dateString = dateString.substr(2)
    }

    if (s.length === 7) {
      s += '-' + dateString.substr(0, 2)
    }

    date.value = s
  })

  $.click('#calc', function (ev) {
    var dateString = date.value
    var outOfLimit = false
    if (/^\d{4}\-\d{2}\-\d{2}$/.test(dateString)) {
      each(dateString.split('-'), function (val, i) {
        if (val < 0 || limit[i] < val) {
          // 简单校验
          console.log('不符合日期规则')
          outOfLimit = true
        }

        toTarget[i].innerHTML = val
      })

      if (outOfLimit) {
        // 可以简单提示
        alert('不符合日期规范')
        return false
      }

      toDate = new Date(dateString)
      if (timerId) {
        clearInterval(timerId)
      }

      // 清除倒计时到期信息(如果有)
      var expired = $('[expired=yes]')
      if (expired) {
        expired.parentNode.removeChild(expired)
      }

      timerId = setInterval(function () {
        var currentDate = new Date()
        var ms = toDate - currentDate
        if (ms <= 0) {
          var h1 = document.createElement('h1')
          h1.setAttribute('expired', 'yes')
          h1.innerText = '倒计时结束啦！'
          $('.count').appendChild(h1)
          clearInterval(timerId)
        }
        var d = Math.floor(ms / (24 * 60 * 60 * 1000))
        var h = Math.floor(ms / (60 * 60 * 1000)) % 24
        var m = Math.floor(ms / (60 * 1000)) % 60
        var s = Math.floor(ms / 1000) % 60

        day.innerHTML = d
        hour.innerHTML = h
        minute.innerHTML = m
        second.innerHTML = s
      }, 1000)
    }
  })
}