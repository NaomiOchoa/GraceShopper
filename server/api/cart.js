const router = require('express').Router()
const {Order, Product, Product_order} = require('../db/models')

//Helper functions

const setCurrentPrice = products => {
  products.forEach(async product => {
    console.log('running set current price')
    product.dataValues.product_order.dataValues.currentPrice = product.get(
      'price'
    )
    await product.save()
  })
}

const getOrderTotal = products => {
  let orderTotal = products.reduce((accum, currVal) => {
    return accum + currVal.get('product_order').get('productSubtotal')
  }, 0)
  return orderTotal
}

router.get('/', async (req, res, next) => {
  try {
    const userCartItems = await Order.findOne({
      where: {userId: req.user.dataValues.id, status: 'cart'},
      include: [
        {
          model: Product,
          attributes: {exclude: ['stock']}
        }
      ]
    })
    setCurrentPrice(userCartItems.products)

    const orderTotal = getOrderTotal(userCartItems.products)

    res.json({products: userCartItems.products, orderTotal: orderTotal})
  } catch (error) {
    next(error)
  }
})

//Update a user's cart to reflect a change in quantity
router.put('/', async (req, res, next) => {
  try {
    const userCart = await Order.findOne({
      where: {userId: req.user.dataValues.id, status: 'cart'}
    })
    await Product_order.update(
      {
        quantity: req.body.quantity
      },
      {
        where: {
          orderId: userCart.dataValues.id,
          productId: req.body.productId,
          purchasedPrice: null
        },
        returning: true,
        plain: true
      }
    )
    const userCartItems = await Order.findOne({
      where: {userId: req.user.dataValues.id, status: 'cart'},
      include: [
        {
          model: Product,
          attributes: {exclude: ['stock']}
        }
      ]
    })

    setCurrentPrice(userCartItems.products)

    const orderTotal = getOrderTotal(userCartItems.products)

    res.json({products: userCartItems.products, orderTotal: orderTotal})
  } catch (error) {
    next(error)
  }
})

//Remove an item from a user's cart
router.delete('/:productId', async (req, res, next) => {
  try {
    const userCart = await Order.findOne({
      where: {userId: req.user.dataValues.id, status: 'cart'}
    })
    await Product_order.destroy({
      where: {
        orderId: userCart.dataValues.id,
        productId: req.params.productId,
        purchasedPrice: null
      }
    })

    const userCartItems = await Order.findOne({
      where: {userId: req.user.dataValues.id, status: 'cart'},
      include: [
        {
          model: Product,
          attributes: {exclude: ['stock']}
        }
      ]
    })

    setCurrentPrice(userCartItems.products)

    const orderTotal = getOrderTotal(userCartItems.products)

    res.json({products: userCartItems.products, orderTotal: orderTotal})
  } catch (error) {
    next(error)
  }
})

//Add an item to a user's cart

//Will need to check that stock is not zero
router.post('/', async (req, res, next) => {
  try {
    const [order, created] = await Order.findOrCreate({
      where: {
        userId: req.user.dataValues.id,
        status: 'cart'
      }
    })
    await Product_order.create({
      orderId: order.id,
      productId: req.body.productId,
      quantity: req.body.quantity
    })
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
})

//1. The checkout route will get the quantity of product_order and the total purchased price
//2. Decrease the inventory quantity based on product_order quantity
//3. Set the price in product_order to the products current price
//4. cahnge the order's status from cart to completed
//5. create a new order (empty cart)
//6. set the new order userId to the user on the session //???
//Questions: unsure about the userid in the url, but how else can we identify which order belongs to which user? Maybe from the order table?
//take out userId in url for security
//additional avlidation to see users are paying the right amount??
//Stripe might be easier to validate user input!!!!!
//url will change to dataValues after fronted is ready
router.put('/checkout', async (req, res, next) => {
  try {
    const currentOrder = await Order.findOne({
      include: [{model: Product}],
      where: {
        userId: req.user.dataValues.id,
        status: 'cart'
      }
    })
    const products = currentOrder.products
    products.forEach(async product => {
      const quantityInOrder = product.product_order.quantity
      const inventoryProduct = await Product.findByPk(product.id)
      await inventoryProduct.update({
        stock: inventoryProduct.stock - quantityInOrder
      })
      await product.product_order.update({
        purchasedPrice: inventoryProduct.price
      })
    })
    //check totalOderPrice is the right amount(the one they saw in cart before check out)
    //Write this as a test to cehck instead of checking on the backend
    // const totalOrderPrice =
    //   products.reduce((accu, product) => {
    //     return accu + product.product_order.quantity * product.purchasedPrice
    //   }, 0) / 100 //can divide 100 on the frontend instead
    await currentOrder.update({
      status: 'completed'
    })
    const newOrder = await Order.create({
      userId: req.user.dataValues.id
    })
    res.json(newOrder)
  } catch (error) {
    next(error)
  }
})

module.exports = router
