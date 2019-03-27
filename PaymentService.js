const cote = require('cote');

const responder = new cote.Responder({ name: 'Order payment responder' });

responder.on('payment', (req, cb) => {
    console.log(randomPaymentResult(), ' - random payment result');
    cb({order: req._id, paymentStatus: randomPaymentResult()});
});

function randomPaymentResult() {
    return Math.random() >= 0.5;
}

