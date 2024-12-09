const router = require('express').Router()
const { Readinglist } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  const readinglist = await Readinglist.create({ userId, blogId })
  res.json(readinglist)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await Readinglist.findByPk(req.params.id)

  if (req.user.id === reading.userId) {
    reading.read = req.body.read
    await reading.save()
    return res.json(reading)
  }
  res.status(401).json({ error: 'wrong user' })
})

module.exports = router
