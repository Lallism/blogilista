const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  if (req.user) {
    await Session.destroy({ where: { userId: req.user.id } })
    return res.status(204).end()
  }
  res.status(401).end()
})

module.exports = router
