window.onload = function () {
  /*
  // ================下面简单了解一下==============
  // h5 可以用 drag，先前知道事件源，也可以用 mouse* 事件处理
  var source = $('#source')
  var target = $('#target')
  $.on(source, 'dragstart', function (ev) {
    console.log('dragstart')
    // 将自身的 id 传过去
    ev.dataTransfer.setData('id', ev.target.id)
  })
  $.on(source, 'drag', function (ev) {
    console.log('drag')
  })
  $.on(source, 'dragend', function (ev) {
    console.log('dragend')
  })

  // ==========================================
  $.on(target, 'dragenter', function (ev) {
    console.log('进入目标元素')
  })
  $.on(target, 'dragover', function (ev) {
    console.log('在目标元素中拖拽')
    ev.preventDefault() 
  })
  $.on(target, 'dragleave', function (ev) {
    console.log('离开目标元素')
  })
  $.on(target, 'drop', function (ev) {
    console.log('drop')
    var id = ev.dataTransfer.getData('id')
    ev.target.appendChild($('#' + id))
  })
  */  

  // ================= 实例代码方案 1 =================
  /*
  var leftBox = $('.left-box')
  var rightBox = $('.right-box')
  // 根据高度(包括外围)来判断是第几个以及放在哪里
  var eachHeight = $('[draggable]').offsetHeight
  var srcDom = null
  // 不可以代理
  // $.delegate(leftBox, 'dragstart', 'div', function (ev) {
    // console.log('it work', ev)
  // })

  // 给每一个都注册
  var draggableObjectList = []
  each(leftBox.children, function (el, i) {
    draggableObjectList.push(el)
    draggableObjectList.push(rightBox.children[i])
  })

  each(draggableObjectList, function (oDiv, i) {
    $.on(oDiv, 'dragstart', function (ev) {
      // 传不了对象，但必须传点数据才能 "通信"，拖拽才起作用
      ev.dataTransfer.setData('justString', ev.target)
      srcDom = ev.target
    })

    $.on(oDiv, 'dragover', function (ev) {
      ev.preventDefault() //使可拖放
    })

    $.on(oDiv, 'drop', function (ev) {
      // 接收就行
      var string = ev.dataTransfer.getData('justString')
      var index = Math.floor(ev.target.offsetTop / eachHeight)
      var targetBox = ev.target.parentNode
      targetBox.insertBefore(srcDom, targetBox.children[index])
      srcDom = null
    })
  })
  */

  // ================= 实例代码方案 2 =================
  var leftBox = $('.left-box')
  var rightBox = $('.right-box')
  var eachWidth = $('.left-box div').offsetWidth
  var eachHeight = $('.left-box div').offsetHeight
  // 注意，这里的判断是以左上角为基准的
  // 修正盒子范围，被拖拽元素有一半长度以上在盒子内即可交换
  var fixWidth = eachWidth / 2
  var fixHeight = eachHeight / 2
  var box = {
    left: getPosition(leftBox),
    right: getPosition(rightBox)
  }
  var boxRange = {
    left: {
      x: [box.left.x - fixWidth, box.left.x + leftBox.offsetWidth - fixWidth],
      y: [box.left.y - fixHeight, box.left.y + leftBox.offsetHeight + fixHeight]
    },
    right: {
      x: [box.right.x - fixWidth, box.right.x + rightBox.offsetWidth - fixWidth],
      y: [box.right.y - fixHeight, box.right.y + rightBox.offsetHeight + fixHeight]
    }
  }

  var dragging = null
  var draggableObjectList = []
  var startX, startY, startOffset
  // 都装进 draggableObjectList，便于后面遍历
  each(leftBox.children, function (el, i) {
    draggableObjectList.push(el)
    draggableObjectList.push(rightBox.children[i])
  })

  // 判断当前拖拽元素的位置是否在盒子内，返回该盒子 | boolean
  function inBox(x, y) {
    var left = boxRange.left
    var right = boxRange.right
    if (isBetween(x, left.x[0], left.x[1]) && isBetween(y, left.y[0], left.y[1])) {
      return leftBox
    } else if (isBetween(x, right.x[0], right.x[1]) && isBetween(y, right.y[0], right.y[1])) {
      return rightBox
    } else {
      return false
    }
  }

  function isBetween(n, n1, n2) {
    if (n1 < n && n < n2) {
      return true
    }

    return false
  }

  // 裁剪 DOM 元素
  function updateElement(toBox, index) {
    toBox.insertBefore(dragging, toBox.children[index])
  }

  // mousemove 事件
  function move(ev) {
    var disX = ev.clientX - startX
    var disY = ev.clientY - startY
    var left = disX + startOffset.x
    var top = disY + startOffset.y
    dragging.style['left'] = left + 'px'
    dragging.style['top'] = top + 'px'
  }

  // mouseup事件
  function up(ev) {
    // 判断坐标是否在另个盒子范围内
    var upPos = getPosition(dragging)
    var ele = inBox(upPos.x, upPos.y)
    // 在盒子内且不在原来的盒子里才更新元素
    if (ele && inNewBox(ele, dragging)) {
      if (ele === leftBox) {
        // 获取坐标上下位置，计算应该放在哪个位置
        var index = Math.floor((upPos.y - box.left.y) / eachHeight) + 1
      } else {
        var index = Math.floor((upPos.y - box.right.y) / eachHeight) + 1
      }
      // 渲染
      updateElement(ele, index)
    }

    afterUp()
  }

  // 事件 -- 改成代理也可以
  each(draggableObjectList, function (el, i) {    
    $.on(el, 'mousedown', function (ev) {
      // 记录当前对象，对象相对左上角的位置和点击瞬间的位置
      dragging = ev.target
      startX = ev.clientX
      startY = ev.clientY
      startOffset = getPosition(dragging)
      addClass(dragging, 'selected')
      $.on(document, 'mousemove', move)
      $.on(document, 'mouseup', up)
    })
  })

  // 判断 ele 是否是 box 里的元素
  function inNewBox(box, ele) {
    var yes = true
    each(box.children, function (child, i) {
      if (child === ele) {
        yes = false
      }
    })

    return yes
  }

  // mouseup 事件底部重置信息
  function afterUp() {
    removeClass(dragging, 'selected')
    dragging.style['left'] = ''
    dragging.style['top'] = ''
    dragging = null
    $.un(document, 'mousemove', move)
    $.un(document, 'mouseup', up)
  }
}