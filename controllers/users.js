const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: { model: Blog, attributes: { exclude: ['userId'] } },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ username, name, passwordHash })
  res.json(user)
})

router.put('/:username', userFinder, async (req, res) => {
  if (req.user) {
    req.user.name = req.body.name
    await req.user.save()
    return res.json(req.user)
  }
  res.status(404).end()
})

module.exports = router
