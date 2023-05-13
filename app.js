const express = require('express') //框架
const exphbs = require('express-handlebars') // 渲染樣板
const methodOverride = require('method-override') // 路由方法覆寫
const session = require('express-session')
const flash = require('connect-flash')

const routes = require('./routes')

const app = express()
const PORT = 3000
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
usePassport(app)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // 設定main.hbs主頁, 渲染樣板的檔案格式為.hbs
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())  
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// req.user 是在反序列化的時候，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

// 將 request 導入路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
