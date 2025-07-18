const mongoose = require('mongoose');
const { Head } = require('./models/flash');
const User = require('./models/user'); // your user model

async function assignUserToExistingDecks() {
    const url= 'mongodb://localhost:27017/'

const dbName='study';
  await mongoose.connect(url+dbName);

  const user = await User.findOne({ email: 'krishna@gmail.com' }); // or use _id
  if (!user) throw new Error('Test user not found');

  const result = await Head.updateMany(
    { user: { $exists: false } }, // only update old documents
    { $set: { user: user._id } }
  );

  console.log(`${result.modifiedCount} decks updated`);
  mongoose.disconnect();
}

assignUserToExistingDecks();
