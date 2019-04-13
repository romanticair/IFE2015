window.onload = function () {
  var search = $('#search')
  var options = $('#options')

  var activeIndex = -1
  var tips = []
  var rawStr = ''
  var data = [
    'Text111', 'Text222', 'Text333', 'Text444',
    'Content111', 'Content222', 'Content333', 'Content444'
  ]

  function getData(txt) {
    var ret = {
      rawStr: txt,
      tips: []
    }

    if (!txt) {
      return ret
    }

    each(data, function (val) {
      // if (val.substr(0, txt.length) === txt) {
      if (val.indexOf(txt) === 0) {
        ret.tips.push(val.substr(txt.length))
      }
    })

    return ret
  }

  // -------------ajax 测试失败------
  /*
  var ret = {
    rawStr: '',
    tips: []
  }

  function dealWithData(data) {
    console.log(data)
    var isShow = options.style['display'] === 'block'
    if (ret.tips.length) {
      if (!isShow) {
        options.style['display'] = 'block'
      }

      toHtml(ret)
      tips = ret.tips
      rawStr = ret.rawStr
    } else if (isShow) {
      options.style['display'] = 'none'
    }

    activeIndex = -1
  }

  function inputListener(ev) {
    if (this.value) {
      ajax('localhost:3000/data',
        {
          type: 'get',
          data: {search: this.value},
          onsuccess: function (data) {
            dealWithData(data)
            ret.tips.push(JSON.parse(data))
          },
          onfail: function (error, ajax) {
            console.log(error, ajax)
          }
      })

      ret.rawStr = this.value
    }
  }
  // -------------ajax----------------
  */

  function toHtml(obj) {
    options.innerHTML = ''
    each(obj.tips, function (val, i) {
      var li = document.createElement('li')
      var a = document.createElement('a')
      var span = document.createElement('span')
      span.innerText = val
      a.innerText = obj.rawStr
      a.appendChild(span)
      li.appendChild(a)
      options.appendChild(li)
    })
  }

  function inputListener(ev) {
    var data = getData(this.value)
    var isShow = options.style['display'] === 'block'
    if (data.tips.length) {
      if (!isShow) {
        options.style['display'] = 'block'
      }
      toHtml(data)
      tips = data.tips
      rawStr = data.rawStr
    } else if (isShow) {
      options.style['display'] = 'none'
    }

    activeIndex = -1
  }

  function clickSelect() {
    var selectedIndex
    each(options.children, function (node, i) {
      if (node === this) {
        selectedIndex = i
      }
    }.bind(this))

    afterSelect(selectedIndex)
  }

  function keydownSelect(index) {
    removeClass($('#options .active'), 'active')
    afterSelect(index)
  }

  // 注册事件
  $.delegate(options, 'li', 'mouseenter', function (ev) {
    addClass(this, 'active')
  })
  $.delegate(options, 'li', 'mouseleave', function (ev) {
    removeClass(this, 'active')
  })

  $.on(search, 'input', inputListener)
  $.delegate(options, 'li', 'click', clickSelect)
  $.on(window, 'keydown', function (ev) {
    // console.log(ev.keyCode) 上38 下40 enter 13
    if (!tips.length) {
      return false
    }
    switch (ev.keyCode) {
      case 38:
        keydownDealer(activeIndex--)
        break
      case 40:
        keydownDealer(activeIndex++)
        break
      case 13:
        keydownSelect(activeIndex)
        break
      default:
        break
    }
  })

  function keydownDealer(preIndex) {
    if (activeIndex >= tips.length) {
      activeIndex = 0
    } else if (activeIndex < 0) {
      activeIndex = tips.length - 1
    }

    if (preIndex === -1) {
      preIndex = 0
    } else if (preIndex === tips.length) {
      preIndex = tips.length - 1
    }

    toggleClass(preIndex, activeIndex)
  }

  function afterSelect(index) {
    search.value = rawStr + tips[index]
    options.style['display'] = 'none'
    tips.length = 0
  }

  function toggleClass(pre, next) {
    removeClass(options.children[pre], 'active')
    addClass(options.children[next], 'active')
  }
}
