const express = require('express')
const mongoose = require("mongoose");
const bodyparser= require("body-parser")
const User = require('./models/user');
const cors = require('cors');

const app = express()
app.use(cors()); 

const port = 5000

app.use(bodyparser.json());

const url= 'mongodb://localhost:27017/'

const dbName='study';

async function main() {
  await mongoose.connect(url+dbName);
}
main();
app.post('/', async (req, res) => {
  const{username, password}= req.body;
  const user= await User.findOne({username});
  if(!user){
    return res.status(401).json({success: false, message: 'Invalid credential'});
  }
  const isMatch= await (password == user.password);
  if(!isMatch){
    return res.status(401).json({success: false, message: 'Invalid credential'});
  }
  res.status(201).json({message:'Login Successful'});
})

app.post('/registration',async (req,res)=>{
  try {
    const { username, password, fullName, gmail } = req.body;

    const newUser = new User({
      username,
      password,
      fullName,
      gmail,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    }
    res.status(500).json({ error: 'Registration failed.' });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
