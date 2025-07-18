  const bcrypt= require('bcrypt');
  const User = require('../models/user');
  const jwt= require('jsonwebtoken');
  const dotenv = require('dotenv');
  dotenv.config();
  
  const signup=async(req,res)=>{
  try {
    console.log(await User.countDocuments({ gmail: null }))
    // await User.deleteMany({ gmail: null });
    const { username, password, fullName, email } = req.body;
    const u= await User.findOne({username})
    if(u){
        return res.status(409)
          .json({
            message: 'Username already exist',
            success: false,
          })
    }

    const em= await User.findOne({email})
    if(em){
        return res.status(409)
          .json({
            message: 'Mail already exist',
            success: false,
          })
    }

     const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      fullName: fullName,
      email: email,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' ,
            success: true,
    });
  } catch (error) {
        console.log(error);
      res.status(500)
        .json({
          message:'Internal Server error',
          success: false,
        })
  }
}

const login=async (req, res) => {
 try{ const{username, password}= req.body;
  const user= await User.findOne({username});
  if(!user){
    return res.status(401).json({success: false, message: 'Invalid credential user'});
  }
  const isMatch= await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(401).json({success: false, message: 'Invalid credential password'});
  }
  
  const jwtToken=jwt.sign(
    {username: user.username, _id:user._id},
    process.env.JWT_SECRET,
    {expiresIn: '24h'}
  )
  console.log(jwtToken)
  res.status(200).json({message:'Login Successful',
    success: true,
    token:jwtToken,
    email:user.email,
    name:user.fullName
  });}
  catch(error){
    console.log(error)
  }
}

module.exports={
  signup,
  login
}