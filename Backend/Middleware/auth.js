const jwt= require('jsonwebtoken')

const ensureAuth=(req,res,next)=>{
    const auth= req.headers['authorization']
    if(!auth){
       
        return res.status(403).json({messgae:'Unauthorized, user not found'});
    }
    try{
          const token = auth.split(' ')[1];
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user = { id: decoded._id }; ;
        next()
    }catch(error){
        console.log(error)
         return res.status(403).json({messgae:'Unauthorized'});
    }
}

module.exports= ensureAuth;