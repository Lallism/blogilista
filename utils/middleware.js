const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).send(err.message)
  } else if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).send(err.message)
  }

  next(err)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = await Session.findByPk(decodedToken.id)

      if (session.expires < Date.now()) {
        session.destroy()
        return res.status(401).json({ error: 'token expired' })
      }

      const user = await User.findByPk(session.userId)

      if (user.disabled) {
        return res.status(401).json({ error: 'account disabled' })
      }

      req.user = user
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }
