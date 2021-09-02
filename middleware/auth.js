const jwt = require('jsonwebtoken');

function auth(req,res,next){

    try {
        const token = req.header('Authorization');
        if(!token) return res.status(400).json({msg : 'Khong phao token'});

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
            if(err) {
                return res.status(400).json({msg : 'Khong phao token'})
            }

            req.user = user ;

            next();
        })
    } catch (err) {
        return res.status(400).json({msg : err.message});
    }

}

module.exports = auth ;