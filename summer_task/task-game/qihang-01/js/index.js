window.onload = function() {
  const bu = document.getElementById('bu')
  const shitou = document.getElementById('shiTou')
  const jiandao = document.getElementById('jianDao')
  const score = document.getElementById('score')
  const options = document.getElementsByClassName('options')[0]
  const showArea = document.getElementsByClassName('show-area')[0]
  const result = document.getElementsByClassName('result')[0]
  const player = document.getElementsByClassName('real-player-seleted')[0]
  const compute = document.getElementsByClassName('compute-player-selected')[0]
  // 方便 lose, win 类名控制
  const playerSpan = player.nextElementSibling
  const computeSpan = compute.nextElementSibling

  let optionsShow = true
  let winCount = 0
  // 平局
  let winner = 'draw'
  let playerSelected, computeSelected

  function init () {
    bind()
  }

  function bind () {
    bindClickListener()
  }

  function bindClickListener () {
    options.addEventListener('click', ev => {
      let target = ev.target
      if (target.localName !== 'img') {
        return false
      }

      // 阻止冒泡，避免触发下面绑定的 document click 事件
      ev.stopPropagation()
      switch (target.id) {
        case 'bu':
          playerSelected = 'bu'
          break
        case 'shiTou':
          playerSelected = 'shitou'
          break
        case 'jianDao':
          playerSelected = 'jiandao'
          break
        default:
          break
      }

      // addClass(target, 'selected')
      computeSelected = randomSelected()
      winner = getWinner()
      changeSelected()
    })
  }

  function randomSelected () {
    return ['bu', 'shitou', 'jiandao'][getRndInt(0, 2)]
  }

  function getWinner () {
    // 平局
    if (playerSelected === computeSelected) {
      return 'draw'
    }

    if (playerSelected === 'bu') {
      if (computeSelected === 'shitou') {
        return 'player'
      } else {
        return 'compute'
      }
    }

    else if (playerSelected === 'shitou') {
      if (computeSelected === 'jiandao') {
        return 'player'
      } else {
        return 'compute'
      }
    }

    else if (playerSelected === 'jiandao') {
      if (computeSelected === 'bu') {
        return 'player'
      } else {
        return 'compute'
      }
    }
  }

  /**
   * 改变显示结果图片的 src
   */
  function changeSelected () {
    // 如果平局，则游戏继续
    if (winner === 'draw') {
      drawDealer()
    } else if (winner === 'player') {
      playerWinDealer()
    } else if (winner === 'compute') {
      computeWinDealer()
    }

    show()
    // 点击任何地方，立即重新开始游戏
    document.addEventListener('click', restartClickDealer)
  }

  function drawDealer () {
    result.innerText = '平局，请继续'
  }

  function playerWinDealer () {
    winCount++
    result.innerText = '你赢了！'
    score.innerText = winCount
    addClass(playerSpan, 'win')
    addClass(computeSpan, 'lose')
  }

  function computeWinDealer () {
    result.innerText = '你输了！'
    addClass(playerSpan, 'lose')
    addClass(computeSpan, 'win')
  }

  function show () {
    player.src = '../../asset/' + playerSelected + '.jpg'
    compute.src = '../../asset/' + computeSelected + '.jpg'
    viewSwitch()
  }

  function viewSwitch () {
    optionsShow = !optionsShow
    // 视图互斥
    options.style['display'] = optionsShow ? 'block' : 'none'
    showArea.style['display'] = optionsShow ? 'none' : 'block'
  }

  function restartClickDealer (ev) {
    // 清除所有样式
    /*
    [bu, shitou, jiandao].forEach(imgNode => {
      removeClass(imgNode, 'selected')
    });
    */

    ['win', 'lose'].forEach(val => {
      removeClass(playerSpan, val)
      removeClass(computeSpan, val)
    })

    // 切换视图
    viewSwitch()
    // 避免事件累积
    document.removeEventListener('click', restartClickDealer)
  }

  function getRnd (start, end) {
    return Math.random() * (end - start) + start
  }

  function getRndInt(min, max) {
    if (arguments.length < 2) {
      max = min
      min = 0
    }
    return Math.floor(getRnd(min, max + 1))
  }

  function addClass(element, className) {
    if (!hasClass(element, className)) {
      element.className = element.className ? [element.className, className].join(' ') : className
    }
  }

  function removeClass(element, className) {
    if (className && hasClass(element, className)) {
      var classNames = element.className.split(/\s+/)
      for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
          classNames.splice(i, 1)
          break
        }
      }

      element.className = classNames.join(' ')
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

  init()
}
