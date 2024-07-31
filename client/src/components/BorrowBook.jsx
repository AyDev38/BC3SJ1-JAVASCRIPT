import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BorrowBook = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/books/${bookId}`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setBook(data[0]))
            .catch(error => console.error('Erreur:', error));
    }, [bookId]);

    const handleBorrow = async () => {
        try {
            const response = await fetch(`/api/emprunts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ bookId })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'emprunt du livre');
            }

            navigate('/borrow_history');
        } catch (err) {
            setError(err.message);
        }
    };

    if (!book) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <h2>Emprunter le Livre: {book.titre}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleBorrow}>Emprunter</button>
        </div>
    );
};

export default BorrowBook;
