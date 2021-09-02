const User = require('../models/userModel');

async function authAdmin(req,res,next){

    try {
        // get user information by id

        const user = await User.findOne({
            _id : req.user.id
        })
        
        if(user.role === 0) return res.status(400).json({msg : 'Quyền truy cập tài nguyên quản trị viên bị từ chối'})

        next();
    } catch (err) {
        return res.status(500).json({msg : err.message})
    }

}

module.exports = authAdmin ;