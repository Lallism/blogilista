const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')
const { SECRET } = require('../utils/config')

router.post('/', async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } })
  const passwordCorrect =
    user === null ? false : bcrypt.compare(req.body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'incorrect username or password' })
  }

  if (user.disabled) {
    return res.status(401).json({ error: 'account disabled' })
  }

  const session = await Session.create({
    userId: user.id,
    expires: Date.now() + 1000 * 60 * 60 * 24,
  })

  const sessionForToken = {
    id: session.id,
  }

  const token = jwt.sign(sessionForToken, SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
