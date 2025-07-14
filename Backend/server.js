const express = require('express')
const mongoose = require("mongoose");
const bodyparser= require("body-parser")

const authRoutes = require('./Routes/authRouter');
const dashboard = require('./Routes/dashboard');
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


app.use('/auth', authRoutes);
app.use('/api', dashboard);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
