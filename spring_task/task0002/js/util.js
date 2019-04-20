/**
 * 值类型，值引用
 * =========================================
 */

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
  // Object.prototype.toString.call 优于 instanceof 优于 typeof
  return Object.prototype.toString.call(arr) === '[object Array]'
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

// 判断reg是否为一个正则表达式，返回一个bool值
function isRegExp(reg) {
  return Object.prototype.toString.call(reg) === '[object RegExp]'
}

// 判断num是否为一个数值对象，返回一个bool值
function isNumber(num) {
  return Object.prototype.toString.call(num) === '[object Number]'
}

// 判断str是否为一个字符串对象，返回一个bool值
function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]'
}

// 判断boolean是否为一个布尔对象，返回一个bool值
function isBoolean(boolean) {
  return Object.prototype.toString.call(boolean) === '[object Boolean]'
}

// 判断date是否为一个日期对象，返回一个bool值
function isDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]'
}

// 判断obj是否为一个对象，返回一个bool值
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 判断arg是否为undefined，返回一个bool值
function isUndefined(arg) {
  return Object.prototype.toString.call(arg) === "[object Undefined]"
}

// 判断是否为window对象或DOM对象之一，返回一个bool值
function isElement(arg) {
  var s = Object.prototype.toString.call(arg)
  return s.indexOf("[object HTML") !== -1 || s.indexOf("[object Window]") !== -1
}

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 */
function isPlain(obj){
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      key
  if (!obj ||
     //一般的情况，直接用toString判断
     Object.prototype.toString.call(obj) !== "[object Object]" ||
     //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
     //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
     //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
     !('isPrototypeOf' in obj)
   ) {
    return false
  }

  //判断new fun()自定义对象的情况
  //constructor不是继承自原型链的
  //并且原型中有isPrototypeOf方法才是Object
  if ( obj.constructor &&
    !hasOwnProperty.call(obj, "constructor") &&
    !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
    return false
  }
  //判断有继承的情况
  //如果有一项是继承过来的，那么一定不是字面量Object
  //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
  for ( key in obj ) {}
  return key === undefined || hasOwnProperty.call( obj, key )
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
  var target
  if (isObject(src)) {
    target = {}
  } else if (isArray(src)) {
    target = []
  } else {
    return src
  }

  for (var key in src) {
    if (includeType(src[key])) {
      // 加 hasOwnProerty 判断，可以忽略掉继承的属性
      // if (src.hasOwnProerty(key))
      if (isObject(src[key]) || isArray(src[key])) {
        // console.log(src[key])
        // 递归
        // target[key] = arguments.callee(src[key])
        target[key] = cloneObject(src[key])
      } else {
        target[key] = src[key]
      }
    }
  }

  return target
}

// 判断attr是否为类型排除列表之一，返回一个bool值
function includeType(attr) {
  var includeFn = {
    isArray: isArray,
    isNumber: isNumber,
    isString: isString,
    isBoolean: isBoolean,
    isDate: isDate,
    isObject: isObject
  }
  for (var fn in includeFn) {
    if (includeFn[fn](attr)) {
      return true
    }
  }

  return false
}


/**
 * 数组、字符串、数字等相关方法
 * =========================================
 */

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
  var ret = []
  // for in 会读取数组上的属性并给过滤掉
  // for (var key in arr) {
  for (var key = 0; key < arr.length; key++) {
    // indexOf 不支持 IE9及以下，需字典处理
    if (ret.indexOf(arr[key]) === -1) {
      ret.push(arr[key])
    }
  }

  return ret
}

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
  var space = ' '
  var tab = '\t'
  var i = 0
  var head = true
  while (true) {
    var char = str.charAt(i)
    if (char !== space && char !== tab) {
      if (head) {
        str = str.substr(i, str.length)
        i = str.length - 1
        head = false
      } else {
        return str.substr(0, i + 1)
      }
    } else if (head) {
      i++
    } else {
      i--
    }
  }

  // Version 2
  /*
  var blank = ' \t'
  for (var i = 0; i < str.length; i++) {
    if (blank.indexOf(str[i]) === -1) {
      break
    }
  }

  for (var j = str.length - 1; i < j; j--) {
    if (blank.indexOf(str[j]) === -1) {
      break
    }
  }

  return str.substring(i, j + 1)
  // return str.slice(i, j + 1)
  */
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
  // return str.replace(/^\s*(.*?)\s*$/g, '$1') 惰性匹配整个字符串，引用中间数据替换全部，较慢
}


 // 去除数组中的空白元素
 // arr = ['', ' ', '\t', ' \t', ' \t ', '\t \n \r ', 'a', ' b', ' c ', 2]
function deleteBlank(arr) {
  var ret = []
  // var re = new RegExp(/^\s{0,}$/)
  var re = new RegExp(/^\s*$/)
  for (i = 0; i < arr.length; i++) {
    if (!re.test(arr[i])) {
      ret.push(arr[i])
    }
  }
  return ret
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
// 其中fn函数可以接受两个参数：item和index
function each(arr, fn) {
  // for (var i = 0; i < arr.length; i++) {
    // 性能更优
  for (var i = 0, len = arr.length; i < len; i++) {
    fn.call(arr[i], arr[i], i)
  }
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
  if (Object.keys) {
    // es5
    return Object.keys(obj).length
  }
  
  var n = 0
  for (var key in obj) {
    if (obj.hasOwnProerty(key)) {
      n++
    }
  }

  return n
}


/**
 * 正则表达式
 * =========================================
 */

// 判断是否为邮箱地址
function isEmail(emailStr) {
  return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(emailStr)
  // 规则不同 -- 至今仍为弄懂邮箱的新增规则
  // ^[a-zA-Z_]{1,}[0-9]{0,}@(([a-zA-z0-9]-*){1,}\.){1,3}[a-zA-z\-]{1,}$
}

// 判断是否为手机号
function isMobilePhone(phone) {
  return /^((13[0-9])|(14[579])|(15[0-9])|(17[0168])|(18[0-9]))\d{8}$/.test(phone)
}


/**
 * DOM
 * =========================================
 */

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
  // setAttribute(key, val) lt ie8 不兼容
  /*
  var classList = element.className.split(' ')
  if (classList.indexOf(newClassName) === -1) {
    classList.push(newClassName)
    element.className = classList.join(' ')
  }
  */

  // version2
  if (!hasClass(element, newClassName)) {
    element.className = element.className ? [element.className, newClassName].join(' ') : newClassName
  }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
  var classList = element.className.split(' ')
  var i = classList.indexOf(oldClassName)
  if (i !== -1) {
    classList.splice(i, 1)
    element.className = classList.join(' ')
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

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
  /* 
  // v1
  var siblingNodes = element.parentNode.children
  for (var i in siblingNodes) {
    if (siblingNodes[i] === siblingNode) {
      return true
    }
  }
  return false
  */

  // v2
  return element.parentNode === siblingNode.parentNode

  // v3
  /*
  for (var node = element.parentNode.firstChild; node; node = node.nextSibling) {
    if (node === siblingNode) {
      return true
    }
  }

  return false
  */
}

// 获取element相对于文档左上角的位置，返回一个对象{x, y}
// https://www.jb51.net/article/138770.htm
function getPosition(element) {
  // 递归计算(直接遍历也可以) -- 相对父盒子距离 offsetTop, offsetLeft，client 不包括 border
  // 获取元素相对于浏览器窗口左上角的位置，可直接用 element.getBoundingClientRect
  var ret = {x: 0, y: 0}
  if (element === null) {
    return ret
  } else {
    ret.x = element.offsetLeft
    ret.y = element.offsetTop
    var recur = getPosition(element.offsetParent)
    ret.x += recur.x
    ret.y += recur.y
    return ret
  }
}


/**
 * Mini $
 * =========================================
 */

// 实现一个简单的Query
function $(selector) {
  if (isElement(selector)) {
    // $($dom) 利于事件
    return selector
  }
  var root = arguments[1] || document
  var selectorList = trim(selector).split(/\s+/)
  var selectorCount = selectorList.length
  var currentSelectorString = selectorList[0]
  var startWith = currentSelectorString.charAt(0)
  var selectedNodes = null
  switch (startWith) {
    case '#':
      selectedNodes = root.getElementById(currentSelectorString.substr(1))
      break
    case '.':
      selectedNodes = root.getElementsByClassName(currentSelectorString.substr(1))
      break
    case '[':
      selectedNodes = root.getElementsByTagName('*') // html，没有 length 属性
      // document.getElementsByTagName('*') 返回 HTMLDocument
      break
    default:
      selectedNodes = root.getElementsByTagName(currentSelectorString)
      break
  }

  // 节点不存在，不再往下找
  if (!selectedNodes || selectedNodes.length === 0) {
    return null
  }

  // 选择器数量两个以上，需遍历所有 selectedNodes 的子节点
  if (selectorCount > 1) {
    var nextSelectorString = selectorList.slice(1).join(' ')
    if (startWith === '[') {
      // 特殊处理，如 [样式属性]
      // var targetAttr = currentSelectorString.substr(1, currentSelectorString.length - 2)
      var targetAttr = currentSelectorString.slice(1, -1)
      var target = getNodeByAttr(selectedNodes, targetAttr)
      // 找得到，则以 target 为根节点寻找下一个
      return target ? $(nextSelectorString, target) : null
    } else if (isUndefined(selectedNodes.length)) {
      // 没有 length 属性的节点(单个)，如 id 选取的节点、html...
      return $(nextSelectorString, selectedNodes)
    } else {
      for (var i = 0; i < selectedNodes.length; i++) {
        var target = $(nextSelectorString, selectedNodes[i]) 
        if (target) {
          return target
        }
      }

      // 找不到
      return null
    }
  } else {
    // 属性寻选择器，特殊处理
    if (startWith === '[') {
      // var targetAttr = currentSelectorString.substr(1, currentSelectorString.length - 2)
      var targetAttr = currentSelectorString.slice(1, -1)
      // return getNodeByAttr(selectedNodes.children, targetAttr)
      return getNodeByAttr(selectedNodes, targetAttr)
    } else {
      // 如有多个节点，只获取第一个，id 无 length
      // 到这里，节点一定是存在的
      return isUndefined(selectedNodes.length) ? selectedNodes : selectedNodes[0]
    }
  }
}

// bug $('#searchSubmit span') $('[data-section-id=topsites]') 已解决
// 递归遍历节点 
function getNodeByAttr(elements, attr) {
  if (!elements.length && elements.children) {
    // 遇到没有 length 属性时，直接传其子节点，更强大
    return getNodeByAttr(elements.children, attr)
  }

  // 用正则更具兼容性
  var items = attr.split('=')
  var key = items[0]
  var value = items[1]
  var target
  for (var i = 0; i < elements.length; i++) {
    // 遍历节点
    var node = elements[i]
    var attrs = node.attributes
    for (var j = 0; j < attrs.length; j++) {
      // 遍历当前节点属性
      // nodeName, localName -> nodeValSue, textContent
      if (attrs[j].name === key) {
        if (!value) {
          return node
        } else if (attrs[j].value === value) {
          return node
        }
      }
    }

    target = getNodeByAttr(node.children, attr)
    if (target) {
      return target
    }
  }

  return null
}


/**
 * Event
 * =========================================
 */

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener, boolean) {
  var delegate = boolean ? true : false
  var event = event.replace(/^on/i, '').toLowerCase()
  if (element.addEventListener) {
    element.addEventListener(event, listener, delegate)
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, listener)
  } else {
    // 几乎都支持标准写法了，下面这句可以去掉
    element['on' + event] = listener
  }
}

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener, boolean) {
  var delegate = boolean ? true : false
  var event = event.replace(/^on/i, '').toLowerCase()
  if (element.removeEventListener) {
    element.removeEventListener(event, listener, delegate)
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, listener)
  } else {
    element['on' + event] = null
  }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
  addEvent(element, 'click', listener)
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
  addEvent(element, 'keydown', function (ev) {
    var ev = ev || window.event
    var code = ev.keyCode || ev.which
    if (code === 13) {
      listener.call(element, ev)
    }
  })
}

function delegateEvent(element, tag, eventName, listener) {
  function proxy(ev) {
    var target = ev.target || ev.strElement
    // target.tagName 是大写的
    each(tag, function (t) {
      if (target.localName === t.toLowerCase()) {
        listener.call(target, ev)
      }
    })
  }

  addEvent(element, eventName, proxy, true)
  // $.on(element, eventName, proxy, true)
}

/**
 * 将 Event 变成对象方法
 * =========================================
 */

/*
// 先简单一些
$.on = addEvent
$.un = removeEvent
$.click = addClickEvent
$.enter = addEnterEvent
$.delegate = delegateEvent
*/

// 改进
$.on = function(selector, event, listener) {
  addEvent($(selector), event, listener)
}

$.un = function(selector, event, listener) {
  removeEvent($(selector), event, listener)
}

$.click = function(selector, listener) {
  addEvent($(selector), 'click', listener)
}

$.delegate = function(selector, tag, event, listener) {
  function proxy(ev) {
    var ev = ev || window.event
    var target = ev.target || ev.srcElement
    if (target.localName === tag.toLowerCase()) {
      listener.call(target, ev)
    }
  }
  addEvent($(selector), event, proxy, true)
}


/**
 * BOM
 * =========================================
 */

// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
  // lt IE8，可选择不同版本的浏览器渲染，navigator可能不准确
  // + RegExp['\x241']  + RegExp[$1]
  return /msie (\d+.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : -1
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
  // 默认一天过期
  var Day = 1000 * 60 * 60 * 24
  var expiredays = expiredays || Day
  var currentDate = new Date()
  currentTime.setDate(currentDate.getDate() + expiredays)
  document.cookie = cookieName + '=' + encodeURIComponent(cookieValue) + ';expires=' + expiredays.toUTCString()
}

// 获取cookie值
function getCookie(cookieName) {
  // 无转义
  // var startIndex = document.cookie.indexOf(cookieName + '=')
  // if (startIndex !== -1) {
  //   var endIndex = document.cookie.indexOf(';', startIndex)
  //   startIndex = cookieName.length + startIndex + 1
  //   endIndex = endIndex === -1 ? document.cookie.length : endIndex
  //   return document.cookie.substring(startIndex, endIndex)
  // } else {
  //   return ''
  // }

  // or
  var cookieItems = document.cookie.split('; ')
  return each(cookieItems, function (itemStr) {
    var item = decodeURIComponent(itemStr).split('=')
    if (item[0] === cookieName) {
      return item[1]
    }
  })
}


/**
 * Ajax
 * ===================未成功======================
 */

function ajax(url, options) {
  // 更低版本的 ie 'Msxml2.XMLHTTP'
  var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
  var type = options.type ? options.type.toUpperCase() : 'GET',
      data = parseData(options.data)

  if (type === 'GET') {
    url = url + '?' + data
    xhr.open(type, url, true)
    xhr.send()
  } else if (type === 'POST') {
    xhr.open(type, url, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    xhr.send(data)
  }

  // xhr.responseType = options.dataType || 'JSON'
  xhr.onreadystatechange = function (status) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (options.onsuccess) {
        // options.onsuccess(xhr.response, xhr)
        options.onsuccess(xhr.responseText, xhr)
      }
    } else if (options.onfail) {
      options.onfail(xhr.responseText, xhr)
    }
  }
}

// 解析 ajax 请求的数据
function parseData(data) {
  var ret = []
  for (var key in data) {
    ret.push(key + '=' + data[key])
  }

  // return encodeURIComponent(ret.join('&'))
  return ret.join('&')
}
