const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models/index')
const { tokenExtractor } = require('../utils/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User, attributes: ['name'] },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  if (req.user) {
    const blog = await Blog.create({ ...req.body, userId: req.user.id })
    return res.json(blog)
  }
  res.status(401).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    return res.json(req.blog)
  }
  res.status(404).end()
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    if (req.user.id === req.blog.userId) {
      await req.blog.destroy()
      return res.status(204).end()
    }
    return res.status(401).json({ error: 'wrong user' })
  } else {
    res.status(404).end()
  }
})

module.exports = router
