const UserRouter = require('./UserRouter')
const ShopRouter = require('./ShopRouter')
const ProductRouter = require('./ProductRouter')
const EventRouter = require('./EventRouter')
const CouponRouter = require('./CouponRouter')
const PaymentRouter = require('./PaymenRouter')
const OrderRouter = require('./OrderRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/shop', ShopRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/event', EventRouter)
    app.use('/api/coupon', CouponRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/order', OrderRouter)
}

module.exports = routes