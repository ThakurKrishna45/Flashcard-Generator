import { React, useState, useEffect } from "react";
import './flashcard.css';

function Flashcard() {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState('');
    const [flashcard,setFlashcard]=useState([]);
    const maxWords = 10000;

    useEffect(() => {
        const words = text.trim(/\s+/);
        const count = words.length;
        setWordCount(count);

        if (count > maxWords) {
            setError(`Exceeded limit by ${count - maxWords} words`);
        } else {
            setError('');
        }
    }, [text]);

    useEffect(()=>{
        const fetchFlashCard=async ()=>{
            const response =await fetch('http://localhost:5000/');
            const data = await response.json();
            console.log(data);
            setFlashcard(data.flashcards || []);
        }
        fetchFlashCard();
    },[])

    const handleChange = (e) => {
        const newtext = e.target.value;
        const words = text.trim(/\s+/);
        if (words.length > maxWords + 100) {
            return;
        }

        setText(newtext);
    };

    const handleClick= async (e)=>{
        e.preventDefault();
        const response = await fetch('http://localhost:5000/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({text}),
        });
        const data = await response.json();
        alert('hello');
    }

    return (
        <>
        <div className="parent">
            <div className="container">
                <h1>Generate Flashcard</h1>
                <textarea
                    value={text}
                    onChange={handleChange}
                    rows="20"
                    cols="50"
                    placeholder="Type your text here..."
                    />
                    <div className="box">
                        <div className="char-count">{wordCount}/10000</div>
                        <div>  <button onClick={handleClick}>Generate</button></div>
                    </div>
            </div>
            <div className="flashcard">
                 {flashcard.map((card) => (
                <div className="div" key={card._id}>
                <div className="ques" >
                    <h2>Questions</h2>
                    <p>{card.question}</p>
                </div>
                <div className="divider"></div>
                <div className="ans">
                    <h2>Answer</h2>
                     <p>{card.answer}</p>
                    </div>
                    </div>
))}
            </div>

        </div>
        </>
    )
} export default Flashcard;