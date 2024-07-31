const express = require('express');
const router = express.Router();
const db = require('./../services/database');
const authenticateToken = require('./users');

router.post('/', authenticateToken, (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    const borrowQuery = 'INSERT INTO emprunts (id_utilisateur, id_livre, date_emprunt, date_retour_prevue) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))';
    const updateBookStatusQuery = 'UPDATE livres SET statut = "emprunté" WHERE id = ?';

    db.query(borrowQuery, [userId, bookId], (err, result) => {
        if (err) {
            console.error('Database borrow query error:', err);
            return res.status(500).json({ error: 'Erreur lors de l\'emprunt du livre.' });
        }

        db.query(updateBookStatusQuery, [bookId], (err) => {
            if (err) {
                console.error('Database update book status query error:', err);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du livre.' });
            }

            res.json({ message: 'Livre emprunté avec succès.' });
        });
    });
});

router.put('/:bookId', authenticateToken, (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.id;

    const returnQuery = 'UPDATE emprunts SET date_retour_effective = NOW() WHERE id_utilisateur = ? AND id_livre = ? AND date_retour_effective IS NULL';
    const updateBookStatusQuery = 'UPDATE livres SET statut = "disponible" WHERE id = ?';

    db.query(returnQuery, [userId, bookId], (err, result) => {
        if (err) {
            console.error('Database return query error:', err);
            return res.status(500).json({ error: 'Erreur lors du retour du livre.' });
        }

        db.query(updateBookStatusQuery, [bookId], (err) => {
            if (err) {
                console.error('Database update book status query error:', err);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du livre.' });
            }

            res.json({ message: 'Livre retourné avec succès.' });
        });
    });
});

router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;

    const historyQuery = 'SELECT livres.titre, emprunts.date_emprunt, emprunts.date_retour_prevue FROM emprunts JOIN livres ON emprunts.id_livre = livres.id WHERE emprunts.id_utilisateur = ?';

    db.query(historyQuery, [userId], (err, results) => {
        if (err) {
            console.error('Database history query error:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des emprunts.' });
        }

        res.json(results);
    });
});

module.exports = router;
