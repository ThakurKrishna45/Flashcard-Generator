import { React, useState, useEffect, useRef } from "react";
import './flashcard.css';
import Navbar from "./Navbar";

function Flashcard() {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState('');
    const [flashcard, setFlashcard] = useState([]);
    const [topic, setTopic] = useState('');
     const [isEditing, setIsEditing] = useState(false);
    const maxWords = 10000;

    const originalTopic = useRef("");
     const typingTimeout = useRef(null);

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


    // useEffect(() => {
        const fetchFlashCard = async (topicToFetch) => {
            const token = localStorage.getItem('token')
            const headers = {
                headers: { 'Authorization': `Bearer ${token}` },
            }
            //  const topicToFetch = topic || originalTopic.current ;
          
                if(!topicToFetch){
                    return;
                }
            const response = await fetch(`http://localhost:5000/api/getOne?topic=${encodeURIComponent(topicToFetch)}`, headers);
            const data = await response.json();
            setTopic(data.topic)
             originalTopic.current = data.topic
            setFlashcard(data.flashcards || []);
        }
    //     fetchFlashCard();
    // }, [topic])

          const handleToggleEdit = async () => {
    if (isEditing && topic.trim() !== originalTopic.current) {
       
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:5000/api/generate/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldTitle: originalTopic.current,
            newTitle: topic.trim(),
          }),
        });
           if (res.status === 409) {
        
          alert("Title already exists");
          setTopic(originalTopic.current); 
          setIsEditing(false);
          return;
        }
       
        if (!res.ok) throw new Error("Update failed");

        originalTopic.current = topic.trim();
         fetchFlashCard(topic.trim());
      } catch (error) {
        console.log(error);
        // alert("Something went wrong while renaming the deck.");
        setTopic(originalTopic.current);
      }
    }
    setIsEditing(!isEditing);
  };

    const handleChange = (e) => {
        const newtext = e.target.value;
        const words = text.trim(/\s+/);
        if (words.length > maxWords + 100) {
            return;
        }

        setText(newtext);
    };

     //  const handleClick = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem('token')
    //     const response = await fetch('http://localhost:5000/api/generate', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify({ text }),
    //     });
    //     if(response.status==401){
    //             localStorage.removeItem('token');
    //         }
    //     const data = await response.json();
    //     setTopic(data.topic);
    //     fetchFlashCard(data.topic);
        
    // }
    const handleClick = async () => {
      try {
        const token = localStorage.getItem('token');

        const resp = await fetch('http://localhost:5000/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }), // send the editor text to backend
        });

        const raw = await resp.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          data = { message: raw };
        }

        if (!resp.ok) {
          const msg = data.error || data.message || `Request failed (${resp.status})`;
          setError(msg);
          alert(msg);
          return;
        }

        // success
        setError('');
        const newTopic = data.topic || topic || originalTopic.current;
        setTopic(newTopic);
        // refresh the flashcard list for the new/returned topic
        fetchFlashCard(newTopic);
      } catch (err) {
        console.error('Network/fetch failed', err);
        const msg = 'Network error: ' + err.message;
        setError(msg);
        alert(msg);
      }
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="parent">
                <div className="container">
                    <div>
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
                        <div>  <button className="gen_button" onClick={handleClick}>Generate</button></div>
                    </div>
                </div>
                </div>

                <div className="flashcard">
                  

                    {flashcard.length === 0 ? (
                        <div className="empty-message">
                            <h2>Your questions and answers will be displayed here.</h2>
                        </div>
                    ) :
                        ( 
                            <>
                        <div className="title">
                        <h2>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                topic
                            )}
                        </h2>
                        <button onClick={() => setIsEditing(handleToggleEdit)}>
                            {isEditing ? 'Save' : 'Edit Title'}
                        </button>
                    </div>
                           { flashcard.map((card) => (
                            <div className="div" key={card._id}>
                                <div className="divider"></div>
                                <div className="ques" >
                                    <h2>Questions</h2>
                                    <p>{card.question}</p>
                                </div>

                                <div className="ans">
                                    <h2>Answer</h2>
                                    <p>{card.answer}</p>
                                </div>
                                <div className="divider"></div>
                            </div>
                              
                        ))}
                        </>)}
                </div>

            </div>
        </>
    )
} export default Flashcard;