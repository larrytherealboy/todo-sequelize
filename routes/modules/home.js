const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', (req, res) => {
  const errors = []

  User.findOne({ where: { email: req.user.email } })
    .then(user => {
      if (!user) {
        console.log('user not found')
      }
      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
        .then((todos) => {
          return res.render('index', { todos: todos })
        })
        .catch((error) => { return res.status(422).json(error) })
    })
    .catch(error => console.log(error))
})

module.exports = router