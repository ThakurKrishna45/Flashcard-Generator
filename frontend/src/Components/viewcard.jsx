import { React, useState, useEffect } from "react";
import styles from './viewcard.module.css';
import { useSearchParams } from "react-router-dom"; 
import Navbar from './Navbar'

export default function Viewcard() {
     const [flashcard, setFlashcard] = useState([]);
      const [searchParams] = useSearchParams();
    const topicToFetch = searchParams.get('topic');
  
     useEffect(() => {
            const fetchFlashCard = async () => {
                const token = localStorage.getItem('token')
                const headers = {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
                const response = await fetch(`http://localhost:5000/api/getOne?topic=${encodeURIComponent(topicToFetch)}`, headers);
                const data = await response.json();
                setFlashcard(data.flashcards || []);
            }
            fetchFlashCard();
        }, [topicToFetch])
  return (
    <div>
         <Navbar></Navbar>
         <div className={styles.c}>
        <div className={styles.flashcard}>
                    <div className={styles.title}>
                        <h2>{topicToFetch}</h2>
                    </div>

                    {
                        flashcard.map((card) => (
                            <div className={styles.div} key={card._id}>
                                <div className={styles.divider}></div>
                                <div className={styles.ques}>
                                    <h2>Questions</h2>
                                    <p>{card.question}</p>
                                </div>

                                <div className={styles.ans}>
                                    <h2>Answer</h2>
                                    <p>{card.answer}</p>
                                </div>
                                <div className={styles.divider}></div>
                            </div>
                        ))}
                </div>
                </div>
    </div>
  )
}
