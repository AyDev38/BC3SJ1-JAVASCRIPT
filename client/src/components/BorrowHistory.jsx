import React, { useState, useEffect } from 'react';

const BorrowHistory = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/emprunts`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setHistory(data))
            .catch(error => {
                console.error('Erreur:', error);
                setError('Erreur lors de la récupération de l\'historique des emprunts');
            });
    }, []);

    return (
        <div>
            <h2>Historique des Emprunts</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {history.map((entry, index) => (
                    <li key={index}>
                        {entry.titre} - Emprunté le: {new Date(entry.date_emprunt).toLocaleDateString()} - Retour prévu le: {new Date(entry.date_retour_prevue).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BorrowHistory;
