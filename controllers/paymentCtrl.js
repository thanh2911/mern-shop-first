const User = require('../models/userModel');
const Products = require('../models/productModel');
const Payment = require('../models/paymentModel');

class paymentCtrl {
    
    async getPayment(req,res){
        try {

            const payment = await Payment.find();

            res.json(payment);
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

    async createPayment(req,res){
        try {

        const user = await User.findById(req.user.id).select('name email');

        if(!user) return res.status(500).json({msg : 'ko co user'})

        const {cart , paymentID , address} = req.body;

        const {_id ,name , email} = user;

        const newPayment = new Payment({
            user_id : _id , name ,email , cart , paymentID , address
        })
        
        cart.filter(item => {
            return sold(item._id, item.quantity, item.sold)
        })
        
        await newPayment.save();

        console.log(newPayment);
        res.json(newPayment);

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    }

}

const sold = async (id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = new paymentCtrl ;