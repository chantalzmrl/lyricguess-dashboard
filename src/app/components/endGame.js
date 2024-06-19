'use client';

import React, { useState, useEffect } from 'react';
import { InsertDatas } from '@/app/lib/data';

const EndGame = ({ score, replay, titres, artistes, paroles }) => {
    const [chansons, setChansons] = useState([]);

    useEffect(() => {
        const insertChansons = async () => {
            try {
                const data = await InsertDatas(titres, artistes, paroles);
                setChansons(data);
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        };

        insertChansons();
    }, [titres, artistes, paroles]);

    function redirectScore() {
        router.push('/dashboard/score');
    }

    return (
        <div>
            <h1>Fin de Partie youpi</h1>
            <p>Votre score: {score}</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={replay}>Rejouer</button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={redirectScore}>Voir tous les scores</button>
            </div>
            <div>
                <h1>Inserted Chansons</h1>
                <ul>
                    {chansons.map((chanson, index) => (
                        <li key={index}>
                            <strong>Title:</strong> {chanson.titre}<br />
                            <strong>Artist:</strong> {chanson.artiste}<br />
                            <strong>Lyrics:</strong> {chanson.paroles}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EndGame;