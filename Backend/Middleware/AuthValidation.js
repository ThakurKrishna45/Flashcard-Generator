const Joi= require('joi');

const signupValidation=(req,res,next)=>{
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(8).required(),
        fullName: Joi.string().required(),
        email: Joi.string().email().min(3).required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message:"Bad request",error})
    }
    next();
}

const loginValidation=(req,res,next)=>{
    const schema=Joi.object({
        username:Joi.string().min(3).max(100).required(),
        password:Joi.string().min(3).max(100).required(),
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({message:"Bad request",error})
    }
    next();
}

module.exports={
    signupValidation,
    loginValidation
}