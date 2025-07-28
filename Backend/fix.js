const mongoose = require('mongoose');
const { Flash, Head ,Newhead} = require('./models/flash');
const User = require('./models/user'); // your user model

async function migrate() {
    const url= 'mongodb://localhost:27017/'

const dbName='study';
  await mongoose.connect(url+dbName);

  try {
  const heads = await Head.find().populate('flashcards');

  for (const head of heads) {
    if (Array.isArray(head.flashcards) && head.flashcards.length > 0) {
      const embeddedFlashcards = head.flashcards.map(flash => ({
        question: flash.question,
        answer: flash.answer
      }));

      const newHead = new Newhead({
        topic: head.topic,
        user: head.user,
        flashcards: embeddedFlashcards
      });

      await newHead.save();
      console.log(`✅ Migrated: ${head.topic}`);
    } else {
      console.warn(`⚠️ Skipped (no flashcards): ${head.topic}`);
    }
  }

  // Optional: clear old flashes after verifying
  // await Flash.deleteMany({});
  console.log('✅ Migration complete.');
} catch (err) {
  console.error('❌ Migration failed:', err);
}


  mongoose.disconnect();
}

migrate();
