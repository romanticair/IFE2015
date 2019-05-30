(function () {
  window.onload = function () {
    var animateNodes = document.getElementsByClassName('animate')

    // 0 start, 1 center, 2 end
    var POSITION = 0

    // 记录页面操作映射
    var ANIMATIONNAME = {
      'toCenter': 'slideLeftFromStart',
      'toEnd': 'slideLeftFromCenter',
      'backCenter': 'slideRightFromEnd',
      'backStart': 'slideRightFromEenter'
    }

    // 记录选中的信息
    var currentCID = 1
    var currentTID = 1
    var currentIndex = 1

    function init() {
      bind()
    }

    function bind() {
      bindTo()
      bindBack()
      bindSwiper()
    }

    function bindTo() {
      var cateUl = document.getElementsByClassName('cate')[0]
      var taskUl = document.getElementsByClassName('task')[0]

      cateUl.addEventListener('touchstart', toCenter)
      taskUl.addEventListener('touchstart', toEnd)

      function toCenter(ev) {
        switchAnimation('toCenter')
        console.log(ev.target.innerText)
      }

      function toEnd(ev) {
        switchAnimation('toEnd')
        console.log(ev.target.innerText)
      }
    }

    function bindBack() {
      var backBtn = document.getElementsByClassName('back')

      backBtn[0].addEventListener('touchstart', backStart)
      backBtn[1].addEventListener('touchstart', backCenter)

      function backStart(ev) {
        switchAnimation('backStart')
      }

      function backCenter(ev) {
        switchAnimation('backCenter')
      }
    }

    function switchAnimation(action) {
      Array.prototype.forEach.call(animateNodes, function (node, i) {
        node.style['animation-name'] = ANIMATIONNAME[action]
      })

      switch (action) {
        case 'toCenter': POSITION = 1; break;
        case 'toEnd': POSITION = 2; break;
        case 'backStart': POSITION = 0; break;
        case 'backCenter': POSITION = 1; break;
        default: break;
      }
    }

    function bindSwiper() {
      var startX

      document.addEventListener('touchstart', function (ev) {
        ev.preventDefault()
        startX = ev.touches[0].pageX
      })

      /*
      document.addEventListener('touchmove', function (ev) {
        var currentX = ev.changedTouches[0].pageX
      })
      */

      // 简单滑屏效果
      document.addEventListener('touchend', function (ev) {
        var endX = ev.changedTouches[0].pageX
        
        if (Math.abs(startX - endX) > 50) {
          // 从左向右滑，边界条件
          if (startX < endX && POSITION !== 0) {
            console.log('右滑动作')
            if (POSITION === 1) {
              switchAnimation('backStart')
            } else {
              switchAnimation('backCenter')
            }

          }

          else if (startX > endX && POSITION !== 2) {
            console.log('左滑动作')
            if (POSITION === 0) {
              switchAnimation('toCenter')
            } else {
              switchAnimation('toEnd')
            }
          }
        }
      })
    }

    init()
  }
})()
