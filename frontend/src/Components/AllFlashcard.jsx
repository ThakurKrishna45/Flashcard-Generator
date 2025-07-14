import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import styles from './AllFlashcard.module.css'

const AllFlashcard = () => {

        const [topic,setTopic]=useState("");
        const [flashcard, setFlashcard]= useState([]);

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

    useEffect(() => {
       const loadData= async() => {
           const token = localStorage.getItem('token')
                const headers = {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            
            const response = await  fetch(`http://localhost:5000/api/all`, headers);
            const data = await response.json();
            setFlashcard(data||[]);
        }
        loadData();
          }, []);
  return (
    <>
    <Navbar></Navbar>
    <div className={styles.container}>
          {/* <div className="title">
                    <h2>No topic to display</h2>
                </div>
                <div className={styles.buttons}>
                    <button>View</button>
                    <button>Delete</button>
                </div> */}
        {flashcard.map((card)=>
         <div className={styles.flashcard} key={card._id}>
                <div className="title">
                    <h2>{card.topic}</h2>
                </div>
                <div className={styles.buttons}>
                    <button>View</button>
                    <button>Delete</button>
                </div>
            </div>
        )}
    </div>
    </>
  )
}

export default AllFlashcard
