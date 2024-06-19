import React, { useState, useEffect, useRef } from 'react';
import { InsertDatas, theBestScore } from '../../lib/data';
import { useRouter } from 'next/navigation';

interface EndGameProps {
    score: number;
    replay: () => void;
    titres: string[];
    artistes: string[];
    paroles: string[];
    time: number;
    manches: number;
}

const EndGame: React.FC<EndGameProps> = ({ score, replay, titres, artistes, paroles, time, manches }) => {

    let initializedMusic = useRef(false);
    const [bestScore, setbestScore] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!initializedMusic.current) {
            const insertChansons = async () => {
                try {
                    console.log(titres);
                    console.log(artistes);
                    console.log(paroles);
                    let isTheBestScore =  await theBestScore(score)
                    // console.log(isTheBestScore);
                    setbestScore(isTheBestScore);
                    // setbestScore(true);
                    await InsertDatas(titres, artistes, paroles, time, manches, score);
                } catch (error) {
                    console.error('Error inserting data:', error);
                }
            };

            insertChansons();
            initializedMusic.current = true;
        }
    }, [titres, artistes, paroles]);

    function redirectScore() {
        router.push('/dashboard/score');
    }

    function redirectFilters() {
        router.push('/dashboard/filters');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-yellow-600 mb-8 text-center">Partie terminée</h1>
            <p className="text-lg text-center">Votre score: <b>{score}</b></p>
            {bestScore &&
                <h1 className="text-xl font-bold text-purple-600 mb-8 text-center">Meilleur score !</h1>
                }
            <div className="w-full h-0 relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={bestScore ? "https://giphy.com/embed/Cdkk6wFFqisTe" : "https://giphy.com/embed/rBszdmXbzglQUX7N4j"}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 rounded-md"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5 mt-8">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={replay}>Rejouer</button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={redirectFilters}>Refaire une partie</button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={redirectScore}>Voir tous les scores</button>
            </div>
        </div>
    );
};

export default EndGame;