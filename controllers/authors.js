const { Sequelize } = require('sequelize')
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      [Sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  })

  res.json(authors)
})

module.exports = router
