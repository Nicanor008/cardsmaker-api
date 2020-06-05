const Payment = require('./payment_model')

exports.makePayment = (req, res) => {
    const { amount, paid } = req.body
    const payment = new Payment({
        amount, paid, user: req.id
    })
    payment.save().then(paid => {
        return res.status(200).json({ message: 'Payment transaction successful', data: paid })
    })
}

// get all user payment details
exports.getAllUserPayment = ( req, res ) => {
    Payment.find({ user:req.id }).then(payment => {
        if(payment.length === 0) {
            return res.status(404).json({ message: 'You haven\'t made any payment yet' })
        }
        return res.status(200).json({ message: 'User payment', data: payment })
    })
}