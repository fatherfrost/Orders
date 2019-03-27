const Order = require('../models/OrderModel');
const cote = require('cote');

const requester = new cote.Requester({ name: 'Order payment requester' });

const request = { type: 'payment', _id: 'order id'};

requester.send(request, (res) => {
     return ({paymentStatus: res.paymentStatus, _id: res.order});
});

module.exports = {
    createOrder: createOrder,
    confirmOrder: confirmOrder,
    cancelOrder: cancelOrder,
    checkOrder: checkOrder,
    getOrders: getOrders
};

function createOrder(req, res) {
    let order = new Order();
    order.name = req.body.name;
    console.log(order, ' order');
    order.save(function (err) {
        if (err) return res.send({success: false, message: 'Error saving order'});
        requester.send({type: 'payment', _id: order._id}, async (result) => {
            console.log(result, ' result');
            if (result.paymentStatus) {
                let a = await confirmOrder(order);
                if (a) {
                    setTimeout(function() {
                        deliverOrder(order);
                    }, 30000);
                }
                return res.send({success: true, message: 'Payment accepted. Your order is confirmed and will be delivered in 30 seconds.'});
            } else {
                return res.send({success: false, message: 'Payment not accepted'})
            }
        })
    });
}

function cancelOrder(req, res) {
    Order.findOne({name: req.body.name})
        .exec((err, order) => {
            if (err) return res.send({success: false, message: 'Error finding order'});
            if (!!order) {
                if (order.isDelivered || order.isCancelled) {
                    return res.send({success: false, message: 'Impossible to cancel delivered or cancelled order'});
                } else {
                    order.isCancelled = true;
                    order.isConfirmed = false;
                    order.save();
                    return res.send({success: true, message: 'Order is canceled.'});
                }
            } else return res.send({success: false, message: 'Order does not exist'});
        })
}

function confirmOrder(orderId) {
    return new Promise((resolve, reject) => {
        Order.findOneAndUpdate({_id: orderId}, {isCancelled: false, isConfirmed: true, isDelivered: false})
            .exec((err, order) => {
                if (err) return reject({success: false, message: 'Error finding order'});
                return resolve(true);
            })
    })
}

function checkOrder(req, res) {
    Order.findOne({name: req.query.name})
        .exec((err, order) => {
            if (err) return res.send({success: false, message: 'Error finding order'});
            if (!!order) {
                let status;
                if (order.isCancelled) {
                    status = 'Order is cancelled';
                } else if (order.isConfirmed && !order.isDelivered) {
                    status = 'Order is confirmed and in delivery';
                } else if (order.isConfirmed && order.isDelivered) {
                    status = 'Order is delivered'
                } else {
                    status = 'Order is created and not confirmed.'
                }
                return res.send({order: order, status : status});
            } else return res.send({success: false, message: 'Order does not exist'});

        })
}

function deliverOrder(orderId) {
    Order.findOneAndUpdate({_id: orderId}, {isDelivered: true})
        .exec((err, order) => {
            if (err) console.log({success: false, message: 'Error updating order'});
            console.log('Order delivered');
        })
}

function getOrders(req, res) {
    Order.find()
        .exec((err, orders) => {
            if (err) return res.send({success: false, message: 'Error finding orders'});
            return res.send({orders: orders});
        })
}






