const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Flash = require('./models/flash');
const dotenv = require('dotenv');
const axios = require('axios'); 


dotenv.config();


const app = express();

app.use(cors());

const PORT = 5000;

app.use(bodyParser.json());

const url = 'mongodb://localhost:27017/';
const dbName = 'study';


async function main() {
    try {
        await mongoose.connect(url + dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    }
}

main();


app.post('/', async (req, res) => {

    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Input text is required.' });
    }

    try {
      
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.YOUR_API_KEY}`,
            {
      
                contents: [
                    {
                        parts: [
                            {
                                text: `Based on the following paragraph, generate concise and important questions and answers suitable for an exam. Ensure the output is a JSON array of objects, where each object has 'question' and 'answer' keys. Example: [{"question": "What is A?", "answer": "B."}, {"question": "What is C?", "answer": "D."}]\n\nParagraph:\n${text}`,
                            }
                        ]
                    }
                ],
              
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "question": { "type": "STRING" },
                                "answer": { "type": "STRING" }
                            },
                            "propertyOrdering": ["question", "answer"]
                        }
                    }
                }
            },
            {
                
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('API Response:', JSON.stringify(response.data, null, 2)); 

        const candidates = response.data.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts && candidates[0].content.parts.length > 0) {
           
            const contentText = candidates[0].content.parts[0].text;

            let qAndA;
            try {
              
                qAndA = JSON.parse(contentText);
            } catch (parseError) {
                console.error('Error parsing content JSON from API:', parseError);
                console.error('Raw content received:', contentText);
                return res.status(500).json({ message: 'Error parsing API response content. The AI might not have returned valid JSON.', error: parseError.message });
            }

          
            if (Array.isArray(qAndA)) {
               
                for (const item of qAndA) {
                    const { question, answer } = item; 
                    if (question && answer) {
                        const qaEntry = new Flash({ question, answer });
                        await qaEntry.save();
                    } else {
                        console.warn('Skipping an item due to missing question or answer:', item);
                    }
                }
                
                res.status(200).json({ message: 'Questions and answers generated and saved successfully.' });
            } else {
                
                console.error('Expected qAndA to be an array, but got:', qAndA);
                res.status(500).json({ message: 'Invalid response format from API. Expected an array of Q&A objects.' });
            }
        } else {
           
            console.error('No valid candidates or content parts found in the API response.');
            res.status(500).json({ message: 'No valid content received from the AI. Please try again.' });
        }
    } catch (error) {
       
        console.error('Error generating content:', error);
        res.status(500).json({ message: 'Error generating questions and answers.', error: error.message });
    }
});

app.get('/', async (req, res) => {
    try {
        const flashcards = await Flash.find({}); // Fetch all documents from the Flash collection
        res.status(200).json(flashcards); // Send them as a JSON response
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ message: 'Error fetching flashcards.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
