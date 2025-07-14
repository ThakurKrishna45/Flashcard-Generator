// const bodyParser = require('body-parser');
const { Flash, Head } = require('../models/flash');
const dotenv = require('dotenv');
const axios = require('axios');


dotenv.config();


// app.use(bodyParser.json());




// app.post('/', async (req, res) => {
const flashgenPost = async (req, res) => {

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
                                text: `Based on the following paragraph or topic, generate important questions and answers suitable for an exam. Ensure the output is a JSON array of objects, where each object has 'question' and 'answer' keys. Example: [{"question": "What is A?", "answer": "B."}, {"question": "What is C?", "answer": "D."}]\n\nParagraph:\n${text}`,
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
            const count = await Head.countDocuments();
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');

            const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

            const random = Math.random().toString(36).substring(2, 6); // e.g. "xk2f"
            const newTopic = `topic-${datePart}_${timePart}_${random}`;


            const newHead = new Head({
                topic: newTopic,
                flashcards: []
            });

            if (Array.isArray(qAndA)) {

                for (const item of qAndA) {
                    const { question, answer } = item;
                    if (question && answer) {
                        const qaEntry = new Flash({ question, answer });
                        await qaEntry.save();
                        newHead.flashcards.push(qaEntry);
                    } else {
                        console.warn('Skipping an item due to missing question or answer:', item);
                    }
                }
                await newHead.save();
                res.status(200).json({ message: 'Questions and answers generated and saved successfully.', topic: newTopic });
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
};

// app.get('/', async (req, res) => {
const flashgenGet = async (req, res) => {
    const count = await Head.countDocuments();
    const newTopic = req.query.topic || `topic${count}`;
    try {
        const flashcard = await Head.findOne({ topic: newTopic });
        res.status(200).json(flashcard); // Send them as a JSON response
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ message: 'Error fetching flashcards.', error: error.message });
    }
};

const flashGetAll = async (req, res) => {
    try {
        const flashcards = await Head.find(); // Fetch all flashcards
        res.status(200).json(flashcards); // Send them as a JSON response
    } catch (error) {
        console.error('Error fetching all flashcards:', error);
        res.status(500).json({ message: 'Error fetching all flashcards.', error: error.message });
    }
};


const titleChange = async (req, res) => {
    const { oldTitle, newTitle } = req.body ?? {};

    if (!oldTitle || !newTitle)
        return res.status(400).json({ message: "oldTitle and newTitle required." });

    if (oldTitle === newTitle) return res.sendStatus(204);

    try {

        const duplicate = await Head.exists({ topic: newTitle });
        if (duplicate)
            return res.status(409).json({ message: "Title already exists." });
        const renamedDeck = await Head.findOneAndUpdate(
            { topic: oldTitle },
            { topic: newTitle },
            { new: true }          // return the updated doc
        );

        if (!renamedDeck)
            return res.status(404).json({ message: "Original deck not found." });
        return res.status(200).json(renamedDeck);
    } catch (err) {
        console.error("Rename deck error:", err);
        res.status(500).json({ message: "Server error.", error: err.message });
    }
};
module.exports = {
    flashgenGet,
    flashgenPost,
    flashGetAll,
    titleChange
}