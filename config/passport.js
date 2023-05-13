const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy

const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User


module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(error => done(error, false))
  }))

  // passport.use(new FacebookStrategy({
  //   clientID: process.env.FACEBOOK_ID,
  //   clientSecret: process.env.FACEBOOK_SECRET,
  //   callbackURL: process.env.FACEBOOK_CALLBACK,
  //   profileFields: ['email', 'displayName']
  // },
  //   (accessToken, refreshToken, profile, done) => {
  //     const { name, email } = profile._json
  //     User.findOne({ where: { email } })
  //       .then(user => {
  //         if (user) return done(null, user)
  //         const randomPassword = Math.random().toString(36).slice(-8)
  //         bcrypt
  //           .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
  //           .then(salt => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
  //           .then(hash => User.create({
  //             name,
  //             email,
  //             password: hash
  //           }))
  //           .then(user => done(null, user))
  //           .catch(error => done(error, false))
  //       })
  //       .catch(error => done(error, false))
  //   }
  // ));

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(error => done(error, null))
  })
}