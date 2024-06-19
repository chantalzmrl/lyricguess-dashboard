'use client';

import { useState, useEffect } from 'react';
import { fetchBestScores, fetchScores } from '../../lib/data';
import { Score } from "../../lib/definitions";
import React from 'react';

export default function Titres() {
    const [scores, setScores] = useState<Score[]>([]);
    const [selectedScore, setSelectedScore] = useState<Score | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const scoresData = await fetchScores();
                setScores(scoresData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOpenPopup = (score: Score) => {
        setSelectedScore(score);
    };

    return (
        <main className="w-3/4 p-5">
            <div className="container mx-auto text-white">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-8 text-purple-600">Classement des scores</h2>
                </div>
                <table className="min-w-full bg-white text-gray-900 rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="bg-gray-700 p-2 text-white">Joueur</th>
                            <th className="bg-gray-700 p-2 text-white">Score</th>
                            <th className="bg-gray-700 p-2 text-white">Date</th>
                            <th className="bg-gray-700 p-2 text-white">Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{score.ID_user || "Chantal et Clem"}</td>
                                <td className="p-2">{score.number}</td>
                                <td className="p-2">{score.timer.toString().substring(0, 10)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleOpenPopup(score)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded w-full"
                                    >
                                        Voir plus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedScore && (
                <div className="fixed inset-0 bg-gray-600 text-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg">
                        <h3 className="text-xl font-bold mb-3">Détails du Score</h3>
                        <p><strong>Score:</strong> {selectedScore.number}</p>
                        <p><strong>Date:</strong> {selectedScore.timer.toString().substring(0, 10)}</p>
                        <div>
                            <strong>Chansons:</strong>
                            <ul>
                                {selectedScore.titres.map((titre, idx) => (
                                    <li key={idx}>{titre}</li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => setSelectedScore(null)} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
