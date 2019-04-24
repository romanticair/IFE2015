window.onload = function () {
  // 执行按钮
  var addCateBtn = document.getElementById('new-cate')
  var addPlanBtn = document.getElementById('new-plan')
  var checkBtn = document.getElementById('check-btn')
  var editBtn = document.getElementById('edit-btn')
  var saveBtn = document.getElementById('save-btn')
  var cancelBtn = document.getElementById('cancel-btn')

  // 数据容器
  var category = document.getElementsByClassName('plans')[0]
  var tabIndexs = document.getElementsByClassName('tab-index')[0]
  var tabItems = document.getElementsByClassName('tab-item')[0]
  var planView = document.getElementsByClassName('plan-view')[0]
  var planEdit = document.getElementsByClassName('plan-edit')[0]
  
  // 输入控件
  var titleInput = document.getElementById('title-input')
  var dateInput = document.getElementById('date-input')
  var detailInput = document.getElementById('editor')

  var planCount = document.getElementsByClassName('count')[0]
  var mask = document.getElementsByClassName('mask')[0]
  var icon = document.getElementsByClassName('icon')[0]

  // 数据是三层结构： 大分类 -> 任务 -> 详细计划，一层层映射
  // 结构设计：
  // 第一层 id、cate
  // 第二层 id、cid、task
  // 第三层 tid、title、date、detail、status

  // var tb1 = [{id: 1, cate: '默认分类'}, {id: 2, cate: '大计划'}]
  // var tb2 = [{id: 1, cid: 1, task: '默认分类子分类'}, {id: 2, cid: 2, cate: '大计划子分类'}]
  // var tb3 = [
  //   {id: 1, tid: 1, plan: '默认分类子分类子计划', date: '*', detail: '*', status: '*'},
  //   {id: 2, tid: 2, plan: '大计划子分类子计划', date: '*', detail: '*', status: '*'}
  // ]

  // 记录选择的元素，默认选择默认分类 ***
  var cates,
      tasks,
      plans,
      selectedCateNode,
      selectedTaskNode,
      selectedPlanNode,
      selectedNode

  var directDesc = [
    '请选择分类，并输入要添加分类的标题！',
    '删除该分类，其全部子分类和计划也会被删除！',
    '提前完成了任务，你真棒！',
    '确定好一个计划是成功的第一步！',
    '计划内容尚未保存，你确定要离开吗？',
    '你确定要更新该计划吗？'
  ]

  var directMap = {
    add: 0,
    delete: 1,
    check: 2,
    save: 3,
    force: 4,
    edit: 5
  }

  var directActions = [add, del, check, save, force, edit]

  function init() {
    loadData()
    initRender()
    initEvent()
  }

  function initEvent() {
    bindCateSwith()
    bindAddCate()
    bindMaskDirect()
    bindTabIndex()
    bindTabItem()
    bindAddPlan()
    bindCancelPlan()
    bindSave()
    bindCheck()
    bindEdit()
  }

  function bindAddCate() {
    $.click(addCateBtn, function (ev) {
      maskSwitch('add')
    })
  }

  function bindCateSwith() {
    $.delegate(category, 'i', 'click', function (ev) {
      var parent = this.parentNode
      // 分四种情况，分别为分类切换|任务选择|分类|子类删除
      selectedNode = parent
      if (parent.tagName === 'H3') {
        cateDealer(parent, this)
      } else if (parent.tagName === 'P') {
        taskDealer(parent, this)
      }
    })
  }

  function taskDealer(p, i) {
    // 可能是删，也可能是选择查阅
    selectedTaskNode = p
    selectedCateNode = p.parentNode
    if (hasClass(i, 'fa-remove')) {
      removeTaskDealer()
    } else {
      openTaskDealer(p)
    }
  }

  function removeTaskDealer() {
    maskSwitch('delete')
  }

  function openTaskDealer(p) {
    each(category.children, function (item) {
      // 避免切换 dir 时， p 的 active 仍保留，所有 p 的 active 都先摘除掉
      each(item.children, function (node) {
        if (node.tagName === 'P') {
          removeClass(node, 'active')
        }        
      })
    })

    var tid = getIdAndPid(p)[0]
    var plans = getTaskPlanList(tid)
    addClass(p, 'active')
    renderTabItem(plans)
  }

  function cateDealer(h3, i) {
    // 可能是删，也可能是选择切换
    selectedCateNode = h3.parentNode
    if (hasClass(i, 'fa-remove')) {
      removeCateDealer(h3)
    } else {
      openCateDealer(h3)
    }
  }

  function removeCateDealer(h3) {
    maskSwitch('delete')
  }

  function openCateDealer(h3) {
    // 方案 1
    /*
    each(category.children, function (item) {
      removeClass(item, 'selected')
    })

    addClass(h3.parentNode, 'selected')
    */

    // 方案 2
    if (hasClass(h3.parentNode, 'selected')) {
      removeClass(h3.parentNode, 'selected')
    } else {
      addClass(h3.parentNode, 'selected')
    }
  }

  function maskSwitch(direct) {
    // 如果前面有处理过表单，则删除
    var hasInput = mask.getElementsByClassName('cate-input')
    if (hasInput.length) {
      icon.parentNode.removeChild(hasInput[0])
      hasInput = null
    }

    if (direct) {
      setAttribute(icon, 'data-direct', direct)
      icon.previousElementSibling.innerText = directDesc[directMap[direct]]

      // add 有表单，特殊处理
      if (direct === 'add') {
        renderAddMask()
      }

      mask.style['display'] = 'block'
    } else {
      mask.style['display'] = 'none'
    }
  }

  // input form of mask
  function renderAddMask() {
    var div = document.createElement('div')
    var input = document.createElement('input')
    var select = document.createElement('select')
    addClass(div, 'cate-input')
    setAttribute(input, 'type', 'text')
    setAttribute(select, 'name', 'cates')

    // 增加一个添加新分类，选择的则是为分类添加子类
    each([{id: 0, cate: '添加新分类'}].concat(cates), function (cate) {
      var o = document.createElement('option')
      o.innerText = cate.cate
      setAttribute(o, 'value', cate.id)
      select.appendChild(o)
    })

    div.appendChild(input)
    div.appendChild(select)
    mask.firstElementChild.insertBefore(div, icon)
  }

  // mask 指令操作
  function bindMaskDirect() {
    $.delegate(icon, 'i', 'click', function (ev) {
      if (hasClass(this, 'fa-plus')) {
        var direct = getAttribute(icon, 'data-direct')
        // 执行相关的操作，add 有表单，特殊处理
        if (direct === 'add') {
          var input = mask.getElementsByTagName('input')[0]
          var select = mask.getElementsByTagName('select')[0]
          var i = select.selectedIndex
          directActions[directMap[direct]](input.value, select.children[i].value)
        } else {
          directActions[directMap[direct]]()
        }
      }

      maskSwitch()
    })
  }


  function del() {
    // 删除大分类|子分类
    var linkIdSet = []
    if (selectedNode.tagName === 'H3') {
      var id = getIdAndPid(selectedCateNode)[0]

      selectedCateNode = null
      selectedNode = null
      
      // 更新数据，层级关系全删掉
      // 分类层
      each([].concat(cates), function (cate, i) {
        if (cate.id === id) {
          cates.splice(i, 1)
        }
      })

      // 子分类层
      each([].concat(tasks), function (task, i) {
        if (task.cid === id) {
          linkIdSet.push(task.id - 0)
          tasks.splice(i, 1)
        }
      })

      storeData('cates', cates)
    } else {
      var id = getIdAndPid(selectedTaskNode)[0]

      // 子分类层
      each([].concat(tasks), function (task, i) {
        if (task.id === id) {
          linkIdSet.push(task.id - 0)
          tasks.splice(i, 1)
        }
      })
    }

    // 计划层
    each([].concat(plans), function (plan, i) {
      if (linkIdSet.indexOf(plan.tid) !== -1) {
        plans.splice(i, 1)
      }
    })

    selectedTaskNode = null
    selectedPlanNode = null
    storeData('tasks', tasks)
    storeData('plans', plans)

    // 从新渲染 default
    initRender()
  }

  function add(inputVal, optionVal) {
    var id = optionVal - 0
    if (id !== 0) {
      // 添加子类
      var newTask = updateTasks(id, inputVal)
      var cate = getCateNodeById(id)
      var task = generateSubCate(newTask)
      cate.appendChild(task)
    } else {
      var newCate = updateCates(inputVal)
      var cate = generateNewCate(newCate)
      category.appendChild(cate)
    }
  }

  function generateI(className, text) {
    var i = document.createElement('i')
    addClass(i, 'fa')
    addClass(i, className)
    text && (i.innerText = text)
    return i
  }

  function generateNewCate(cate) {
    var li = document.createElement('li')
    var h3 = document.createElement('h3')
    // 不包括完成的
    var n = getCatePlanCount(cate.id, true)
    var i = generateI('fa-folder', cate.cate + '（' + n + '）')
    h3.appendChild(i)
    if (cate.id === 1) {
      // 选中默认分类且不给删除
      addClass(li, 'selected')
    } else {
      h3.appendChild(generateI('fa-remove'))
    }

    addClass(li, 'item')
    li.setAttribute('i', cate.id)
    li.appendChild(h3)
    return li
  }

  function generateSubCate(task) {
    var p = document.createElement('p')
    // 不包括完成的
    var n = getTaskPlanCount(task.id, true)
    var i = generateI('fa-file', task.task + '（' + n + '）')
    p.appendChild(i)

    if (task.id === 1) {
      // 默认子类
      addClass(p, 'active')
    } else {
      p.appendChild(generateI('fa-remove'))
    }

    p.setAttribute('i', task.id)
    p.setAttribute('pid', task.cid)
    return p
  }

  function bindTabIndex() {
    each(tabIndexs.children, function (node) {
      $.click(node, clickListener)
    })

    function clickListener(ev) {
      var ev = ev || window.event
      var target = ev.target || ev.srcElement
      var n = getAttribute(target, 'data-type')
      each(tabIndexs.children, function (node, i) {
        removeClass(node, 'active')
        removeClass(tabItems.children[i], 'current')
      })

      addClass(target, 'active')
      addClass(tabItems.children[n - 1], 'current')
    }
  }

  function bindTabItem() {
    $.delegate(tabItems, 'p', 'click', function (ev) {
      selectedPlanNode = this
      var id = getIdAndPid(this)[0]
      var plan = getPlanById(id)

      each(tabItems.getElementsByClassName('active'), function (p) {
        removeClass(p, 'active')
      })

      addClass(this, 'active')
      updateViewPage(plan)
    })
  }

  function renderTabItem(plans) {
    var preItem = null
    // render 之前先清除
    clearTabItem()
    // 升降序
    sortByDate(plans)
    // 渲染三个 ul
    each(tabItems.children, function (item, index) {
      each(plans, function (plan, i) {
        if (index === 0) {
          // 全部
          // 日期相同，则为相同项
          if (i !== 0 && plan.date === plans[i - 1].date) {
            renderTabSubItem(preItem, plan)
          } else {
            preItem = renderOneTabItem(item, plan)
          }
        } else if (index === 1 && !isFinished(plan)) {
          // 未完成
          if (i !== 0 && plan.date === plans[i - 1].date) {
            renderTabSubItem(preItem, plan)
          } else {
            preItem = renderOneTabItem(item, plan)
          }
        } else if (index === 2 && isFinished(plan)) {
          // 已完成
          if (i !== 0 && plan.date === plans[i - 1].date) {
            renderTabSubItem(preItem, plan)
          } else {
            preItem = renderOneTabItem(item, plan)
          }
        }
      })
    })

    preItem = null
  }

  function renderOneTabItem(parent, plan) {
    var li = document.createElement('li')
    var h3 = document.createElement('h3')

    h3.innerText = plan.date
    li.appendChild(h3)
    renderTabSubItem(li, plan)
    parent.appendChild(li)

    return li
  }

  function renderTabSubItem(parent, plan) {
    var p = document.createElement('p')
    p.innerText = plan.plan
    p.setAttribute('i', plan.id)
    p.setAttribute('pid', plan.tid)
    if (isFinished(plan)) {
      addClass(p, 'finished')
      p.appendChild(generateI('fa-save'))
    }

    parent.appendChild(p)
  }

  function clearTabItem() {
    each(tabItems.children, function (item) {
      item.innerHTML = ''
    })
  }

  function updateViewPage(plan) {
    var name = planView.getElementsByClassName('plan-name')[0]
    var date = planView.getElementsByClassName('plan-date')[0]
    var detail = planView.getElementsByClassName('plan-detail')[0]
    name.innerText = plan.plan
    date.innerText = plan.date
    detail.innerText = plan.detail
    switchSaveOrEdit()
    switchDetailPage()
  }

  function clearDetailPage(clearEdit) {
    if (clearEdit) {
      titleInput.value = ''
      dateInput.value = ''
      detailInput.value = ''
    } else {
      planView.getElementsByClassName('plan-name')[0].innerText = ''
      planView.getElementsByClassName('plan-date')[0].innerText = ''
      planView.getElementsByClassName('plan-detail')[0].innerText = ''
    }
  }

  function switchDetailPage(isEditPage) {
    if (isEditPage) {
      planView.style['display'] = 'none'
      planEdit.style['display'] = 'block'
    } else {
      planEdit.style['display'] = 'none'
      planView.style['display'] = 'block'
    }
  }

  function bindAddPlan() {
    $.click(addPlanBtn, function (ev) {
      if (selectedTaskNode) {
        clearDetailPage(true)
        switchDetailPage(true)
      } else {
        window.alert('请选择新计划的从属任务项目')
      }
    })
  }

  function bindCancelPlan() {
    $.click(cancelBtn, function (ev) {
      // cancel 分两类操作，一是修改操作的返回，二是新计划的退出
      var direct = getAttribute(planEdit, 'direct')
      if (direct === 'edit' || isEmtpyIpput()) {
        // 修改指令的退出操作直接切换，不对原数据进行修改
        // 如果是改操作的返回，要还原回去
        switchSaveOrEdit()
        switchDetailPage()
      } else {
        // 提供强制离开选项
        maskSwitch('force')
      }
    })
  }

  function force() {
    // 直接切换 View 页面
    switchDetailPage()
  }

  function isEmtpyIpput() {
    return !(trim(titleInput.value) || trim(dateInput.value) || trim(detailInput.value))
  }

  function bindSave() {
    $.click(saveBtn, function (ev) {
      if (dataVerifyFail(getData())) {
        // 友好的提示
        window.alert('当前结构不符合一个完整计划的规范，请继续完善计划内容！')
        return false
      }

      var direct = getAttribute(planEdit, 'direct')
      maskSwitch(direct)
    })
  }

  function save() {
    var plan = getData()
    plan = addStatus(plan)

    if (planExist(plan)) {
      return window.alert('该计划已存在任务列表中！')
    }

    var tid = getIdAndPid(selectedTaskNode)[0]
    plan = updatePlans(tid, plan)
    updatePage(plan)
  }

  function planExist(plan) {
    // 暂不做任何校验
    return false
  }

  function getData() {
    var plan = trim(titleInput.value)
    var date = trim(dateInput.value)
    var detail = trim(detailInput.value)
    return {
      plan: plan,
      date: date,
      detail: detail
    }
  }

  function dataVerifyFail(plan) {
    // 简单规则，暂不做提示
    if (plan.plan.length < 2 || plan.plan.length > 20) {
      return true
    }
    if (!/^([1-2]\d{3})[\/|\-](0?[1-9]|10|11|12)[\/|\-]([1-2]?[0-9]|0[1-9]|30|31)$/.test(plan.date)) {
      return true
    }

    if (plan.detail.length < 4 || plan.detail.length > 50) {
      return true
    }

    return false
  }

  function addStatus(plan) {
    extend(plan, {status: 0})
    return plan
  }

  function updatePage(plan) {
    // 在此之前已经更新全局数据
    updateCatePage()
    updateTaskPage(plan)

    var plans = getTaskPlanList(plan.tid)

    renderTabItem(plans)
    // 清空输入
    clearDetailPage(true)
    updateViewPage(plan)
  }

  function updateCatePage() {
    // 只有 save 和 check 时才会触发
    var i1 = selectedCateNode.getElementsByClassName('fa-folder')[0]
    var i2 = selectedTaskNode.getElementsByClassName('fa-file')[0]

    var cid = getIdAndPid(selectedCateNode)[0]
    var tid = getIdAndPid(selectedTaskNode)[0]
    var n1 = getCatePlanCount(cid, true)
    var n2 = getTaskPlanCount(tid, true)

    // 更新所有任务数量，任务状态列表计划数量
    updateTotalCount()
    i1.innerText = i1.innerText.replace(/\（\d+/, '（' + n1)
    i2.innerText = i2.innerText.replace(/\（\d+/, '（' + n2)
  }

  function updateTaskPage(plan) {
    // 直接更新整个任务页
    var plans = getTaskPlanList(plan.tid)
    renderTabItem(plans)
  }

  function bindCheck() {
    $.click(checkBtn, function (ev) {
      if (!selectedPlanNode) return false

      var id = getIdAndPid(selectedPlanNode)[0]
      var plan = getPlanById(id)

      if (isFinished(plan)) {
        alert('本任务已完成！')
      } else {
        maskSwitch('check')
      }
    })
  }

  function check() {
    var ids = getIdAndPid(selectedPlanNode)
    var plan = getPlanById(ids[0])
    var plans = getTaskPlanList(ids[1])

    // 标记已完成，引用类型，直接生效
    plan.status = 1
    renderTabItem(plans)

    // 更新计划数量
    updateCatePage()

    // 写入 localStorage
    storeData('plans', plans)
  }

  function bindEdit() {
    $.click(editBtn, function (ev) {
      var id = getIdAndPid(selectedPlanNode)[0]
      var plan = getPlanById(id)
      if (isFinished(plan)) {
        alert('你已完成该任务！')
      } else {
        updateEditPage(plan)
      }
    })
  }

  function updateEditPage(plan) {
    clearDetailPage(true)
    // 修改 plan-edit direct 属性值，标记本操作为修改未完成计划
    switchSaveOrEdit(true)

    titleInput.value = plan.plan
    dateInput.value = plan.date
    detailInput.value = plan.detail
    switchDetailPage(true)
  }

  function edit() {
    var editPlan = getData()
    var id = getIdAndPid(selectedPlanNode)[0]
    var plan = getPlanById(id)

    // 修改的只能日期，标题，内容
    // 已经过数据校验，这里直接匹配有无修改，操作引用并保存即可
    var change = false
    if (plan.plan !== editPlan.plan) {
      plan.plan = editPlan.plan
      change = true
    }

    if (plan.date !== editPlan.date) {
      plan.date = editPlan.date
      change = true
    }

    if (plan.detail !== editPlan.detail) {
      plan.detail = editPlan.detail
      change = true
    }

    if (change) {
      // 更新数据
      storeData('plans', plans)
      updatePage(plan)
    }

    // 切回 View 页面
    updateViewPage(plan)
  }

  function switchSaveOrEdit(isEdit) {
    // plan-edit 的 save-btn 操作可能是修改未完成计划 | 添加新计划
    if (isEdit) {
      setAttribute(planEdit, 'direct', 'edit')
    } else {
      setAttribute(planEdit, 'direct', 'save')
    }
  }

  function updateTotalCount() {
    // 所有任务数量
    planCount.innerText = '所有任务' + '（' + getAllPlanCount() + '）'
  }

  function initRender() {
    updateTotalCount()

    // 大分类
    category.innerHTML = ''
    each(cates, function (cate) {
      var li = generateNewCate(cate)
      each(tasks, function (task) {
        if (task.cid === cate.id) {
          var p = generateSubCate(task)
          li.appendChild(p)
        }
      })

      category.appendChild(li)
    })

    // 状态侧 -- 默认子分类页
    // 包括已完成的，plan.tid === 1
    var defaultPlans = getTaskPlanList(1)
    renderTabItem(defaultPlans)

    // 详细页 -- 默认计划页
    // 保证渲染 id === 1 的 plan
    var defaultDetail = getObjectById(defaultPlans, 1)
    updateViewPage(defaultDetail)

    // 保存引用
    selectedCateNode = category.getElementsByClassName('selected')[0]
    selectedTaskNode = category.getElementsByClassName('active')[0]
    selectedPlanNode = tabItems.getElementsByClassName('finished')[0]
    addClass(selectedPlanNode, 'active')
  }

  function loadData() {
    var storage = window.localStorage
    var s1 = storage.getItem('cates')
    var s2 = storage.getItem('tasks')
    var s3 = storage.getItem('plans')
    formatData(s1, s2, s3)
  }

  function formatData(s1, s2, s3) {
    // 必须有默认选项
    if (hasDefault(s1, s2, s3)) {
      cates = JSON.parse(s1)
      tasks = JSON.parse(s2)
      plans = JSON.parse(s3)
    } else {
      addDefault()
      loadData()
    }
  }

  function hasDefault(cate, task, plan) {
  // default 的 cate task plan id 只能是 1，对应着 addDefault
  return /\"id\":1/gi.test(cate) &&
         /\"id\":1,\"cid\":1/gi.test(task) &&
         /\"id\":1,\"tid\":1/gi.test(plan)
  }

  function addDefault() {
    var cate = [{id: 1, cate: '默认分类'}]
    var task = [{id: 1, cid: 1, task: '操作指南'}]
    var plan = [{id: 1, tid: 1, plan: '请阅读我', date: '2019-04-20', detail: '本 APP 为离线 APP，数据将存储在本地硬盘！\n\n左侧为大分类列表，其下有子分类任务列表\n中间为当前分类下的任务列表\n右侧为详情计划内容\n\n可以添加或删除分类、任务、计划，也可以修改计划内容，标记计划完成情况。\n\n\nBy Romantic.', status: 1}]
    storeData('cates', cate)
    storeData('tasks', task)
    storeData('plans', plan)
  }

  function sortByDate(arrObj, reverse) {
    arrObj.sort(function (a, b) {
      var d1 = (new Date(a.date)).getTime()
      var d2 = (new Date(b.date)).getTime()
      if (d1 > d2) {
        return reverse ? 1 : -1
      } else if (d2 > d1) {
        return reverse ? -1 : 1
      } else {
        return 0
      }
    })
  }

  function storeData(key, val) {
    // 同名会重置
    window.localStorage.setItem(key, JSON.stringify(val))
  }

  function isFinished(plan) {
    // status: 1 代表已完成
    return plan.status === 1
  }

  function getIdAndPid(dom) {
    var id = getAttribute(dom, 'i')
    var pid = getAttribute(dom, 'pid')
    return [id - 0, pid - 0]
  }

  function getCateNodeById(id) {
    var node
    var id = id - 0
    each(category.children, function (li) {
      if (parseInt(getAttribute(li, 'i')) === id) {
        return node = li
      }
    })

    return node
  }

  function getCateById(cid) {
    return getObjectById(cates, cid)
  }

  function getTaskById(tid) {
    return getObjectById(tasks, tid)
  }

  function getPlanById(pid) {
    return getObjectById(plans, pid)
  }

  function getObjectById(oArr, id) {
    var o
    var id = id - 0
    each(oArr, function (item) {
      if (item.id === id) {
        return o = item
      }
    })

    return o
  }

  function getCateTaskList(cid) {
    var l = []
    var cid = cid - 0
    each(tasks, function (task) {
      if (task.pid === cid) {
        l.push(task)
      }
    })

    return l
  }

  function getTaskPlanList(tid, isExcludeFinished) {
    var o = []
    var tid = tid - 0
    each(plans, function (plan) {
      if (plan.tid === tid) {
        if (isExcludeFinished) {
          (!isFinished(plan) && o.push(plan))
        } else {
          o.push(plan)
        }
      }
    })

    return o
  }

  function getCatePlanList(cid, isExcludeFinished) {
    var o = []
    var cid = cid - 0
    each(tasks, function (task) {
      if (task.cid === cid) {
        // 保证从属关系
        each(plans, function (plan) {
          if (plan.tid === task.id) {
            if (isExcludeFinished) {
              (!isFinished(plan) && o.push(plan))
            } else {
              o.push(plan)
            }
          }
        })
      }
    })

    return o
  }

  function getTaskPlanCount(tid, isExcludeFinished) {
    return getTaskPlanList(tid, isExcludeFinished).length
  }

  function getCatePlanCount(cid, isExcludeFinished) {
    return getCatePlanList(cid, isExcludeFinished).length
  }

  function getAllPlanCount() {
    // 包括已完成的
    return plans.length
  }

  function updateCates(s) {
    var id = generateNewId(cates)
    var o = {id: id, cate: s}
    cates.push(o)
    storeData('cates', cates)
    return o
  }

  function updateTasks(cid, s) {
    var id = generateNewId(tasks)
    var o ={id: id, cid: cid, task: s}
    tasks.push(o)
    storeData('tasks', tasks)
    return o
  }

  function updatePlans(tid, plan) {
    var id = generateNewId(plans)
    // extend 亦可行
    var o = {
      id: id,
      tid: tid,
      plan: plan.plan,
      date: plan.date,
      detail: plan.detail,
      status: plan.status
    }

    plans.push(o)
    storeData('plans', plans)
    return o
  }

  function generateNewId(arr) {
    var max = 1
    each(arr, function (o) {
      if (o.id > max) {
        max = o.id
      }
    })

    return ++max
  }

  function setAttribute(el, attr, v) {
    var i = attr.indexOf('data-')
    if (i !== -1) {
      el.dataset && (el.dataset[attr.slice(i + 5)] = v)
    } else {
      el.setAttribute(attr, v)
    }
  }

  function getAttribute(el, attr) {
    var i = attr.indexOf('data-')
    if (i !== -1) {
      return el.dataset && el.dataset[attr.slice(i + 5)]
    }

    return el.getAttribute(attr)
  }

  function extend(destination, source) {
    for (var attr in source) {
      if (source.hasOwnProperty(attr)) {
        destination[attr] = source[attr]
      }
    }
  }

  init()
}
