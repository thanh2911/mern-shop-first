const User = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userCtrl {

    async register(req,res) {
       try {
            
        const {name , email,password} = req.body ;

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg : 'Email da bi trung'});
        }

        if(password.length < 6){
            return res.status(400).json({msg : 'Nhap password 6 or hon'});
        }

        // chuyen hoa bao mat password
        const passwordHash = await bcrypt.hash(password,10);

        

        const newUser = new User({
            name ,
            email,
            password : passwordHash
        })

        // Save user vao mongodb
        await newUser.save();


        // jsonwebtoken to auth

        const accesstoken = createAccessToken({id : newUser._id})
        const refreshtoken = createRefreshToken({id : newUser._id})

        res.cookie('refreshtoken',refreshtoken,{
            httpOnly: true ,
            path : '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7d
        })

        res.json({accesstoken})

       } catch (err) {
           return res.status(400).json({msg : err.message});
       }
    }

    async login(req,res){
        try {
            
            const {email,password} = req.body ;
    
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg : 'Email ko dung'});
            }
            
             // giai bao mat password
            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({msg : 'password ko dung'});
            }
            
            // jsonwebtoken to auth
    
            const accesstoken = createAccessToken({id : user._id})
            const refreshtoken = createRefreshToken({id :user._id})
    
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true ,
                path : '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })
    
            res.json({accesstoken})
    
           } catch (err) {
               return res.status(400).json({msg : err.message});
           }
    }


    async logout(req,res) {
        try {
            res.clearCookie('refreshtoken',{path : '/user/refresh_token'})
            return res.json({msg : 'Logout '});
        } catch (err) {
            return res.status(400).json({msg : err.message});
        }
    }

    async refreshToken(req,res){
        
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token){
                return res.status(400).json({msg : 'lam on login hoac register'})
            }

            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user) =>{
                if(err) {
                    return res.status(400).json({msg : 'lam on login hoac register'})
                }

                const accesstoken = createAccessToken({id : user.id})

                res.json({user,accesstoken})
            })

        } catch (err) {
            return res.status(400).json({msg : err.message});
        }
    }

    async getUser(req,res){
       try {
           const user = await User.findById(req.user.id).select('-password');
           
           if(!user){
            return res.status(400).json({msg : 'ko co user'});
           
           }
           res.json({user})
       } catch (err) {
        return res.status(400).json({msg : err.message});
       }
    }

    async addCart(req,res){
        try {
            const user = await User.findById(req.user.id);
           
            if(!user){
             return res.status(400).json({msg : 'ko co user'});
            
            }

            await User.findOneAndUpdate({_id : req.user.id},{
                cart : req.body.cart
            })

            return res.json({msg : "Added to cart"})
        } catch (err) {
            return res.status(400).json({msg : err.message});
        }
    }

    async history(req,res){
        try {
            const history = await Payments.find({user_id : req.user.id});
            res.json(history)
        } catch (err) {
            return res.status(400).json({msg : err.message});
        }
    }


}

const createAccessToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '11m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn : '7d'})
}

module.exports = new userCtrl;