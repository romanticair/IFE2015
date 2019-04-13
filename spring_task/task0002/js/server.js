var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
var port = process.env.PORT || 3000
var router = express.Router()

var data = {
  message: [
    'Text111', 'Text222', 'Text333', 'Text444',
    'Content111', 'Content222', 'Content333', 'Content444',
    'Dontent111', 'Dontent222', 'Dontent333', 'Dontent444'
  ]
}

function each(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn.call(arr[i], arr[i], i)
  }
}

router.get('/', function (req, res) {
  res.send('<h1>Hello</h1>')
})

router.get('/data', function (req, res) {
  var query = req.query
  var ret = []
  each(data.message, function (val) {
    if (val.indexOf(query.search) === 0) {
      ret.push(val.substr(query.search.length))
    }
  })

  console.log(ret)

  res.header("Access-Control-Allow-Origin", "*")
  // res.header('Content-Type', 'application/json;charset=utf-8')
  res.json(ret)
})

app.use('/', router)
app.listen(port)
console.log('Service on port ' + port)
