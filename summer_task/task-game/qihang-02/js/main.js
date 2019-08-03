$(function () {
  var game2048 = function ($) {
    var $numBox = $('.num-container')
    var $scoreBox = $('.score-box')
    var $restart = $('.restart-btn')
    var initN = 2
    var gridN = 4
    var unoccupiedPos = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44]
    var occupiedPosRows = []
    var occupiedPosCols = []
    var score = 0

    // 随机初始化生成 initN 个数字格子
    function init() {
      for (var i = 0; i < initN; i++) {
        generateNumGrid()
      }

      bind()
    }

    // 方向控制
    function bind() {
      $(document).keydown(function (e) {
        var isSlide = false
        switch(e.keyCode) {
          case 37:
            isSlide = slideLeft()
            break
          case 38:
            isSlide = slideUp()
            break
          case 39:
            isSlide = slideRight()
            break
          case 40:
            isSlide = slideDown()
            break
        }

        // 阻止默认行为，生成格子
        if (isSlide) {
          e.preventDefault()
          e.stopPropagation()
          generateNumGrid()
        }
      })

      $restart.click(function (e) {
        if (confirm('开始新一局游戏？')) {
          $numBox.html('')
          
          score = 0
          unoccupiedPos.length = 0
          occupiedPosRows.length = 0
          occupiedPosCols.length = 0
          unoccupiedPos = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44]
          for (var i = 0; i < initN; i++) {
            generateNumGrid()
          }
        }
      })
    }

    function isWin() {
      var num = pos = null
      return occupiedPosRows.some(function (el, i) {
        pos = parseXY(el)
        num = parseInt($('.num-pos-' + pos.x + '-' + pos.y).find('div').text())
        return num == 2048
      })
    }

    function isLose() {
      if (unoccupiedPos.length != 0) {
        return false
      }

      var horizontalNum = []
      var verticalNum = []
      var num = pos = null
      occupiedPosRows.forEach(function (el, i) {
        pos = parseXY(el)
        num = parseInt($('.num-pos-' + pos.x + '-' + pos.y).find('div').text())
        horizontalNum.push(num)
      })

      occupiedPosCols.forEach(function (el, i) {
        pos = parseXY(el)
        num = parseInt($('.num-pos-' + pos.x + '-' + pos.y).find('div').text())
        verticalNum.push(num)
      })

      // 横向是否还可以合并，可以则没输
      var hTag = horizontalNum.every(function (el, i, arr) {
        if (i == arr.length - 1 || i % gridN == 3 || el != arr[i + 1]) {
          // 每个都满足则表示无棋可走
          return true
        } else {
          return false
        }
      })

      // 纵向是否还可以合并，可以则没输
      var vTag = verticalNum.every(function (el, i, arr) {
        if (i == arr.length - 1 || i % gridN == 3 || el != arr[i + 1]) {
          return true
        } else {
          return false
        }
      })

      return hTag && vTag
    }

    function slideUp() {
      var prePosTag = null
      var isSlide = false
      var len = occupiedPosCols.length
      for (var i = 0; i < len; i++) {
        var posTag = occupiedPosCols[i]
        if (parseInt(posTag / 10) == 1) {
          continue
        }

        for (var j = 1; j < gridN; j++) {
          posTag = occupiedPosCols[i] - 10 * j
          if (occupiedPosCols.indexOf(posTag) != -1) {
            var ret = isMerge(posTag, occupiedPosCols[i])
            if (ret[0]) {
              merge(ret[1], ret[2], ret[3], ret[4])
              occupiedPosRows.splice(occupiedPosRows.indexOf(occupiedPosCols[i]), 1)
              unoccupiedPos.push(occupiedPosCols[i])
              occupiedPosCols[i] = posTag
              isSlide = true
            } else {
              posTag = posTag + 10
            }

            break
          }

          if (parseInt(posTag / 10) == 1) {
            break
          }
        }

        if (posTag != occupiedPosCols[i]) {
          slide(posTag, occupiedPosCols[i])
          updatePos(posTag, occupiedPosCols[i])
          isSlide = true
        }
      }

      occupiedPosCols = [...(new Set(occupiedPosCols))]
      return isSlide
    }

    function slideDown() {
      var prePosTag = null
      var isSlide = false
      var len = occupiedPosCols.length
      for (var i = len - 1; i >= 0; i--) {
        var posTag = occupiedPosCols[i]
        if (parseInt(posTag / 10) == 4) {
          continue
        }

        for (var j = 1; j < gridN; j++) {
          posTag = occupiedPosCols[i] + 10 * j
          if (occupiedPosCols.indexOf(posTag) != -1) {
            var ret = isMerge(posTag, occupiedPosCols[i])
            if (ret[0]) {
              merge(ret[1], ret[2], ret[3], ret[4])
              occupiedPosRows.splice(occupiedPosRows.indexOf(occupiedPosCols[i]), 1)
              unoccupiedPos.push(occupiedPosCols[i])
              occupiedPosCols[i] = posTag
              isSlide = true
            } else {
              posTag = posTag - 10
            }

            break
          }

          if (parseInt(posTag / 10) == 4) {
            break
          }
        }

        if (posTag != occupiedPosCols[i]) {
          slide(posTag, occupiedPosCols[i])
          updatePos(posTag, occupiedPosCols[i])
          isSlide = true
        }
      }

      occupiedPosCols = [...(new Set(occupiedPosCols))]
      return isSlide
    }

    function slideRight() {
      var prePosTag = null
      var isSlide = false
      var len = occupiedPosRows.length
      for (var i = len - 1; i >= 0; i--) {
        var posTag = occupiedPosRows[i]
        if (posTag % 10 == 4) {
          continue
        }

        for (var j = 1; j < gridN; j++) {
          posTag = occupiedPosRows[i] + j
          if (occupiedPosRows.indexOf(posTag) != -1) {
            var ret = isMerge(posTag, occupiedPosRows[i])
            if (ret[0]) {
              merge(ret[1], ret[2], ret[3], ret[4])
              // 要更新Col的和unoccupiedPos
              occupiedPosCols.splice(occupiedPosCols.indexOf(occupiedPosRows[i]), 1)
              unoccupiedPos.push(occupiedPosRows[i])
              occupiedPosRows[i] = posTag
              isSlide = true
            } else {
              posTag--
            }

            break
          }

          if (posTag % 10 == 4) {
            break
          }
        }

        if (posTag != occupiedPosRows[i]) {
          slide(posTag, occupiedPosRows[i])
          updatePos(posTag, occupiedPosRows[i])
          isSlide = true
        }
      }

      occupiedPosRows = [...(new Set(occupiedPosRows))]
      return isSlide
    }

    function slideLeft() {
      var prePosTag = null
      var isSlide = false
      var len = occupiedPosRows.length
      for (var i = 0; i < len; i++) {
        var posTag = occupiedPosRows[i]
        if (posTag % 10 == 1) {
          // 在最左侧的不用滑动
          continue
        }

        for (var j = 1; j < gridN; j++) {
          posTag = occupiedPosRows[i] - j
          if (occupiedPosRows.indexOf(posTag) != -1) {
            // 已有占位，看看能不能合并
            var ret = isMerge(posTag, occupiedPosRows[i])
            if (ret[0]) {
              // 可以合并
              merge(ret[1], ret[2], ret[3], ret[4])
              // 方便计算,使其不进入空位滑动
              occupiedPosCols.splice(occupiedPosCols.indexOf(occupiedPosRows[i]), 1)
              unoccupiedPos.push(occupiedPosRows[i])
              occupiedPosRows[i] = posTag
              isSlide = true
            } else {
              posTag++
            }

            break
          }

          if (posTag % 10 == 1) {
            break
          }
        }

        // 滑动
        if (posTag != occupiedPosRows[i]) {
          slide(posTag, occupiedPosRows[i])
          updatePos(posTag, occupiedPosRows[i])
          isSlide = true
        }
      }

      // 过滤相同项
      occupiedPosRows = [...(new Set(occupiedPosRows))]
      return isSlide
    }

    function merge(pos1, pos2, n1, n2) {
      var total = n1 + n2
      // 借用引用删除，因为位置重复
      var $old = $('.num-pos-' + pos1.x + '-' + pos1.y)
      var $new = $('.num-pos-' + pos2.x + '-' + pos2.y)
      score += total
      $new.removeClass('num-pos-' + pos2.x + '-' + pos2.y)
        .addClass('num-pos-' + pos1.x + '-' + pos1.y)
        .find('div')
        .removeClass('num-' + n2)
        .addClass('num-' + total)
        .text(total)

      $scoreBox.text(score)
      flyScore(total)
      $old.remove()
    }


    // 判断两个格子是否可用合并，并且返回相关信息
    function isMerge(posTag1, posTag2) {
      var pos1 = parseXY(posTag1)
      var pos2 = parseXY(posTag2)
      var n1 = parseInt($('.num-pos-' + pos1.x + '-' + pos1.y).find('div').text())
      var n2 = parseInt($('.num-pos-' + pos2.x + '-' + pos2.y).find('div').text())
      return n1 == n2 ? [true, pos1, pos2, n1, n2] : [false]
    }

    function slide(toPosTag, fromPosTag) {
      var pos1 = parseXY(toPosTag)
      var pos2 = parseXY(fromPosTag)
      $('.num-pos-' + pos2.x + '-' + pos2.y)
        .removeClass('num-pos-' + pos2.x + '-' + pos2.y)
        .addClass('num-pos-' + pos1.x + '-' + pos1.y)
    }

    // 加分效果
    function flyScore(n) {
      var endLine = -100
      var $span = $('<span>+' + n + '</span>')
      var timer = setInterval(function () {
        var val = parseInt($span.css('top'))
        if (val <= endLine) {
          $span.remove()
          clearInterval(timer)
          return
        }

        $span.css('top', val - 10 + 'px')
      }, 35)

      $span.appendTo($scoreBox)
    }

    // 随机生成数字格子
    function generateNumGrid() {
      // 随机数字
      var num = rnd2Or4()
      // 随机未占用格子的位置
      var posTag = rndPos()
      var pos = parseXY(posTag)
      var $newNum = $('<div></div>').addClass('num' + ' num-pos-' + pos.x + '-' + pos.y)
      $('<div></div>')
        .addClass('num-' + num)
        .text(num)
        .appendTo($newNum)

      $newNum.appendTo($numBox)
      updatePos(posTag)

      // 判断输赢
      if (isWin()) {
        window.alert('Win')
      }
      if (isLose()) {
        window.alert('Lose')
      }
    }

    function parseXY(n) {
      var x = parseInt(n / 10)
      var y = n % 10
      return { x: x, y: y }
    }

    function rnd2Or4() {
      return [2, 4][Math.round(Math.random())]
    }

    function rndPos() {
      return unoccupiedPos[Math.round(Math.random() * (unoccupiedPos.length - 1))]
    }

    function updatePos(posTag, old) {
      var index = unoccupiedPos.indexOf(posTag)
      if (index != -1) {
        unoccupiedPos.splice(index, 1)
      }

      // 将变化之后的位置消除掉
      if (old) {
        occupiedPosRows.splice(occupiedPosRows.indexOf(old), 1)
        occupiedPosCols.splice(occupiedPosCols.indexOf(old), 1)
        unoccupiedPos.push(old)
        unoccupiedPos.sort()
      }

      if (occupiedPosRows.indexOf(posTag) == -1 || occupiedPosCols.indexOf(posTag) == -1) {
        // 避免合并时重复添加位置标志
        occupiedPosRows.push(posTag)
        occupiedPosCols.push(posTag)
        occupiedPosRows.sort()
        
        // 列的特殊处理，从左到右，从上到下排序
        var eachCol = [[], [], [], []]
        occupiedPosCols.forEach(function (posN) {
          var pos = parseXY(posN)
          if (pos.y == 1) {
            eachCol[0].push(pos)
          } else if (pos.y == 2) {
            eachCol[1].push(pos)
          } else if (pos.y == 3) {
            eachCol[2].push(pos)
          } else if (pos.y == 4) {
            eachCol[3].push(pos)
          }
        })

        // 清空
        occupiedPosCols.length = 0
        eachCol.forEach(function (arr) {
          arr.sort(function (pos1, pos2) {
            if (pos1.x < pos2.x) {
              return -1
            } else {
              return 1
            }
          })

          // 排序后再放回容器
          arr.forEach(function (pos) {
            occupiedPosCols.push(pos.x * 10 + pos.y)
          })
        })
      }
    }

    return {
      init: init,
    }
  }($)

  game2048.init()
})
