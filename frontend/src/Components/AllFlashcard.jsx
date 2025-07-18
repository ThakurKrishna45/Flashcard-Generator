import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import styles from './AllFlashcard.module.css'

const AllFlashcard = () => {

    const [topic, setTopic] = useState("");
    const [flashcard, setFlashcard] = useState([]);

    //     useEffect(() => {
    //         const fetchFlashCard = async () => {
    //             const token = localStorage.getItem('token')
    //             const headers = {
    //                 headers: { 'Authorization': `Bearer ${token}` },
    //             }
    //              const topicToFetch = topic ;
    // //            console.log(`topic: ${topic}`);
    // // console.log(`originalTopic: ${originalTopic.current}`);
    // if(!topic){
    //     return;
    // }
    //             const response = await fetch(`http://localhost:5000/api/getOne?topic=${encodeURIComponent(topicToFetch)}`, headers);
    //             const data = await response.json();
    //             setTopic(data.topic)
    //              originalTopic.current = data.topic
    //             setFlashcard(data.flashcards || []);
    //         }
    //         fetchFlashCard();
    //     }, [topic])
    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                headers: { 'Authorization': `Bearer ${token}` },
            };
            const response = await fetch(`http://localhost:5000/api/all`, headers);
            const data = await response.json();
            setFlashcard(data || []);
        } catch (error) {
            
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (idToDelete) => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/delete/${idToDelete}`
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
            )
            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                console.log('Resource deleted successfully!', data.message);
                loadData();
                // Optionally, you can update the UI or state here
            } else {
                const errorData = await response.json(); // Get error details
                console.error('Failed to delete resource:', errorData.message);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    return (
        <>
            <Navbar></Navbar>
            <div className={styles.container}>
                {flashcard.length === 0 ? (
                    <><div className={styles.flashcard} >
                        <h2>No topic to display</h2>
                    </div></>) :
                    (flashcard.map((card) =>
                        <div className={styles.flashcard} key={card._id}>
                            <div className="title">
                                <h2>{card.topic}</h2>
                            </div>
                            <div className={styles.buttons}>
                                <button>View</button>
                                <button onClick={() => handleDelete(card.topic)}>Delete</button>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default AllFlashcard
