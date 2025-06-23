const { GoogleGenAI } = require('@google/genai');
const express= require('express')
const mongoose= require('mongoose')
const bodyparser= require('body-parser')
const cors= require('cors')
const Flash = require('./models/flash');
const dotenv= require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app= express();
app.use(cors());
const PORT = 5000

app.use(bodyparser.json());

const url= 'mongodb://localhost:27017/'

const dbName='study';

const ai = new GoogleGenAI({ apiKey: process.env.YOUR_API_KEY });

async function main() {
  await mongoose.connect(url+dbName);
}

main();

// app.post('/',async (req,res)=>{
//   const {text}=req.body;
//     const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: `Based on the following paragraph, generate concise and important questions and answers for exam (genrate output in json file):\n\n${text}`,
//   });
//   console.log(response.text);
//    const qAndA = response.data; // Access the data array
//         // Save each question and answer to MongoDB
//         for (const item of qAndA) {
//             const { question, answer } = item; // Destructure question and answer
//             if (question && answer) {
//                 const qaEntry = new Flash({ question, answer });
//                 await qaEntry.save(); // Save to MongoDB
//             }
//         }
//         res.status(200).json({ message: 'Questions and answers generated and saved successfully.' });
// })

const openai = new OpenAI({
    apiKey: process.env.YOUR_API_KEY,
});
app.post('/', async (req, res) => {
    const { text } = req.body;

    try {
        const completion =  await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `Generate important question-answer flashcards for exam preparation based on this paragraph. Return output as an array of JSON objects like: [{ "question": "...", "answer": "..." }, ...]\n\nParagraph:\n${text}`
                }
            ],
            temperature: 0.7,
        });

        // Try parsing the response into a JSON object
        let qAndA;
        try {
            qAndA = JSON.parse(completion.data.choices[0].message.content);
        } catch (parseErr) {
            return res.status(500).json({ error: "Failed to parse OpenAI response into JSON format.", raw: completion.data.choices[0].message.content });
        }

        for (const item of qAndA) {
            const { question, answer } = item;
            if (question && answer) {
                const qaEntry = new Flash({ question, answer });
                await qaEntry.save();
            }
        }

        res.status(200).json({ message: 'Flashcards generated and saved successfully.' });

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Something went wrong while generating flashcards.' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

