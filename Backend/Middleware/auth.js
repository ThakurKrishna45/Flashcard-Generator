const jwt= require('jsonwebtoken')

const ensureAuth=(req,res,next)=>{
    const auth= req.headers['authorization']
    if(!auth){
        return res.status(403).json({messgae:'Unauthorized, user not found'});
    }
    try{
        const decoded= jwt.verify(auth.split(' ')[1],process.env.JWT_SECRET);
        req.user=decoded;
        next()
    }catch(error){
         return res.status(403).json({messgae:'Unauthorized'});
    }
}

module.exports= ensureAuth;