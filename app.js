const express = require('express') //框架
const exphbs = require('express-handlebars') // 渲染樣板
const methodOverride = require('method-override') // 路由方法覆寫
const bcrypt = require('bcryptjs') // 密碼保護
const app = express()
const PORT = 3000

const db = require('./models')
const Todo = db.Todo
const User = db.User


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // 設定main.hbs主頁, 渲染樣板的檔案格式為.hbs
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.send('hello world')
})
app.get('/users/login', (req, res) => {
  res.render('login')
})
app.post('/users/login', (req, res) => {
  res.send('login')
})
app.get('/users/register', (req, res) => {
  res.render('register')
})
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.redirect('/'))
})


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
