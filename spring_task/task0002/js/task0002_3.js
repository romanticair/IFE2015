function swiper(options) {
  var opt = {
    swiperBox: 'swiper-box',
    controler: 'swiper-controler',
    swiper: 'swiper',
    positiveSeq: true,
    circle: true,
    speed: 2000
  }

  // 覆盖
  extend(opt, options)
  var box = $('#' + opt.swiperBox)
  var swiper = $('#' + opt.swiper)
  var controlerList = $('#' + opt.controler).children

  // ==========方案2增加的，其它都在底部增加==========
  // 前后一个 clone 一个
  // swiper.insertBefore(swiper.children[swiper.children.length - 1].cloneNode(true), swiper.children[0])
  // swiper.appendChild(swiper.children[1].cloneNode(true))
  // ==========方案2增加的，其它都在底部增加==========

  var len = swiper.children.length
  var eachWidth = parseInt(getComputedStyle(swiper.children[0], null)['width'])
  var transitionTime = parseInt(getComputedStyle(swiper, null)['transition-duration']) * 1000
  var totalWidth = len * eachWidth

  // 样式
  box.style['width'] = eachWidth + 'px'
  swiper.style['width'] = totalWidth + 'px'
  // 不加这句，第一个切换 transition 不生效
  swiper.style['left'] = 0

  // 行为
  var timerId = null,
      activeIndex = 0,
      preIndex = 0

  // ==================方案1==================
  timerId = setInterval(autoSwiper, opt.speed)

  // swiper - auto
  function autoSwiper(newIndex) {
    preIndex = activeIndex
    if (newIndex || newIndex === 0) {
      // 直接切换入口，差点忽视了 0 值
      activeIndex = newIndex
    } else if (opt.positiveSeq) {
      // 到了右边边界，回到最左边
      if (len - 1 <= activeIndex) {
        if (!opt.circle) {
          // 不循环则直接结束
          clearInterval(timerId)
          return
        }

        activeIndex = -1
        // 边界，利用样式过渡时间进行控制开始的时间
        intervalSwitch()
      }

      activeIndex++
    } else {
      // 到了左边边界，回到最右边
      if (activeIndex <= 0) {
        if (!opt.circle) {
          // 不循环则直接结束
          clearInterval(timerId)
          return
        }

        activeIndex = len
        intervalSwitch()
      }

      activeIndex--
    }

    // 切换
    swiperTo(activeIndex)
    controler(activeIndex)
  }

  // event -- 代理
  $.delegate('#' + opt.controler, 'li', 'click', function (ev) {
    // this 则是点击到的事件源 li 对象本身 || ev.target
    // console.log(this)

    // 如何拿到 index
    // var newIndex = this.parentNode.children.indexOf(this) x
    var newIndex
    each(this.parentNode.children, function (li, i) {
      if (li === this) {
        newIndex = i
      }
    }.bind(this))
    
    // 新一轮轮播，速度过快时，动画没走完可能就要切换了，所以...
    intervalSwitch()
    // 点击立即生效
    autoSwiper(newIndex)
  })

  // swiper-controler
  function controler(index) {
    removeClass(controlerList[preIndex], 'active')
    addClass(controlerList[index], 'active')
  }

  // 切换
  function swiperTo(index) {
    swiper.style['left'] = - index * eachWidth + 'px'
  }

  function intervalSwitch() {
    // 缺点，调用过于频繁
    clearInterval(timerId)
    setTimeout(function () {
      timerId = setInterval(autoSwiper, opt.speed)
    }, transitionTime)
  }


  // ==================方案2==================
  /*
  swiper.style['left'] = - eachWidth + 'px'
  timerId = setInterval(autoSwiper, opt.speed)
  // activeIndex [-1, 5]，-1 是向左走出现的极限，5 是向右走出现的极限，动画完成后都需要立即跳转
  var leftLimit = 0
  var rightLimit = len - 3
  function autoSwiper(newIndex) {
    preIndex = activeIndex
    swiper.style['transition'] = transitionTime/1000 + 's'
    if (newIndex || newIndex === 0) {
      // 点击立即生效
      activeIndex = newIndex
    } else if (opt.positiveSeq) {
      // 左 -> 右
      // (4) -> (0)，先让其完成 (4) -> 0 的动画，再直接定位到 (0)
      if (activeIndex === rightLimit) {
        // 4 [(0) 1 2 3 (4)] 0
        // 动画过渡后，立即从 0 切换到 (0)
        clearInterval(timerId)
        swiperTo(rightLimit + 2, redirectTo, eachWidth, 0)
        controler(0)
        return
      }
        
      activeIndex++
    } else {
      // 右 -> 左
      // (0) -> (4)，和上面类似
      if (activeIndex === leftLimit) {
        clearInterval(timerId)
        swiperTo(0, redirectTo, (rightLimit + 1) * eachWidth, rightLimit)
        controler(rightLimit)
        return
      }

      activeIndex--
    }

    swiperTo(activeIndex + 1)
    controler(activeIndex)
  }

  function swiperTo(index, cb, left, newIndex) {
    swiper.style['left'] = -index * eachWidth + 'px'
    // 重定位置回调
    if (cb) {
      setTimeout(function () {
        cb(left, newIndex)
      }, transitionTime)
    }
  }

  function redirectTo(left, index) {
    swiper.style['transition'] = 'none'
    swiper.style['left'] = -left + 'px'
    activeIndex = index
    timerId = setInterval(autoSwiper, opt.speed)
  }

  $.delegate('#' + opt.controler, 'li', 'click', function (ev) {
    var newIndex
    each(this.parentNode.children, function (li, i) {
      if (li === this) {
        newIndex = i
      }
    }.bind(this))
    
    clearInterval(timerId)
    autoSwiper(newIndex)
    setTimeout(function () {
      timerId = setInterval(autoSwiper, opt.speed)
    }, transitionTime)
  })
  */
}

// 对象浅复制
function extend(destination, source) {
  for (var attr in source) {
    if (source.hasOwnProperty(attr)) {
      destination[attr] = source[attr]
    }
  }
}
