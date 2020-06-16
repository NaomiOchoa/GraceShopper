const db = require('../db')
const User = require('./user')
const Inventory = require('./inventory')
const Cart = require('./cart')
const Order = require('./order')

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Inventory, {through: Cart})
Inventory.belongsToMany(User, {through: Cart})

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  db,
  User,
  Order,
  Inventory,
  Cart
}
