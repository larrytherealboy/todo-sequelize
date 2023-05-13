const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// 增todos表單
router.get('/new', (req, res) => {
  return res.render('new')
})

// 改todo表單
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.findOne({ where: { UserId, id } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 增toods
router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  return Todo.create({ UserId, name }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 刪todo
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.destroy({ where: { UserId, id } })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

// 改todo
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findOne({ where: { UserId, id } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// 查todo
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

module.exports = router