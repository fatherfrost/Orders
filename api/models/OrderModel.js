const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isCreated: {
      type: Boolean,
      default: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Order', orderSchema);
