const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')

const paymentCtrl = require('../controllers/paymentCtrl')

router.route('/payments')
    .get(auth,authAdmin,paymentCtrl.getPayment)
    .post(auth,paymentCtrl.createPayment)

module.exports = router;