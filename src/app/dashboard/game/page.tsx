'use client';

import { useState, useEffect, useRef } from 'react';
import { useFetchRandomMusic } from '../../components/useFetchRandomMusic';
import { useFetchLyrics } from '../../components/useFetchLyrics';

export default function Page() {
    const APIClem = "748abbee5cd03af50b25df7d90712004";
    const APIChan = "cc714dd978bb466ab1647a1930dab0eb";
    const APIChan2 = "fea0e303280abb2f95f0cec07585cc19";
    const APIChan3 = "4ac4dc543416ddc84a76fc91c72cd98e";

    const [ScoreTotal, setScoreTotal] = useState(0);
    const [ScoreManche, setScoreManche] = useState(100);
    const [nbManche, setNbManche] = useState(0);
    const [inputVisible, setInputVisible] = useState(true);
    const [choicesVisible, setChoicesVisible] = useState(false);
    const [choices, setChoices] = useState([]);
    let initializedMusic = useRef(false);
    let initializedLyric = useRef(false);

    const [triggerFetch, setTriggerFetch] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const [showEntireLyric, setShowEntireLyric] = useState(false);
    const [showArtist, setShowArtist] = useState(false);
    const [currentLyric, setCurrentLyric] = useState({ entireLyric: '', halfLyric: '' });

    const { musicId, artist, title, tabTitles } = useFetchRandomMusic(APIChan2, triggerFetch, initializedMusic);
    const { entireLyric, halfLyric } = useFetchLyrics(APIChan2, musicId, initializedLyric);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(interval);
                    if (nbManche < 10) {
                        generateNewMusic();
                    } else {
                        endGame();
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [triggerFetch, nbManche]);

    useEffect(() => {
        if (entireLyric && halfLyric) {
            setCurrentLyric({ entireLyric, halfLyric });
        }
    }, [entireLyric, halfLyric]);

    const percentageLeft = (timeLeft / 90) * 100;

    function validateAnswer(event) {
        event.preventDefault();
        const input = document.getElementById('answer')?.value;
        const inputHTML = document.getElementById('answer');
        if (inputHTML) {
            if (input === title) {
                inputHTML.style.backgroundColor = '#69E688';
                if (nbManche < 10) {
                    generateNewMusic();
                } else {
                    endGame();
                }
            } else {
                inputHTML.style.backgroundColor = '#E36032';
            }
        }
    }

    function revealArtist() {
        setShowArtist(true);
        setScoreManche(ScoreManche => ScoreManche - 20);
    }

    function addLyric() {
        setShowEntireLyric(true);
        setScoreManche(ScoreManche => ScoreManche - 20);
    }

    function showChoices() {
        setInputVisible(false);
        setChoicesVisible(true);
        setScoreManche(ScoreManche => ScoreManche - 30);
        setChoices(tabTitles);
    }

    function handleChoiceClick(choice) {
        if (title === choice) {
            generateNewMusic();
        }
    }

    function generateNewMusic() {
        setInputVisible(true);
        setChoicesVisible(false);
        setChoices([]);
        setScoreTotal(ScoreTotal => ScoreTotal + ScoreManche);
        setScoreManche(100);
        setNbManche(nbManche => nbManche + 1);

        initializedMusic.current = false;
        initializedLyric.current = false;

        setTriggerFetch(!triggerFetch);
        setTimeLeft(90);
        setShowEntireLyric(false);
        setShowArtist(false);
        setCurrentLyric({ entireLyric: '', halfLyric: '' });
    }

    function endGame() {
        console.log("fin de partie, score = " + ScoreTotal);
    }

    return (
        <main className="flex flex-col items-center p-5">
            <h1 className="text-3xl font-bold mb-4">Jeu de Paroles</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-5 text-center">
                        <p id="lyric" className="text-lg overflow-y-auto h-96 w-auto p-6" dangerouslySetInnerHTML={{ __html: showEntireLyric ? currentLyric.entireLyric : currentLyric.halfLyric }}></p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={addLyric}>Plus de paroles</button>
                    </div>
                </div>
                <div>
                <div className="mb-5 text-center">
                        <p className="text-xl">Temps restant : {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                        <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
                            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percentageLeft}%` }}></div>
                        </div>
                    </div>
                    {inputVisible && (
                        <form onSubmit={validateAnswer} method="post" className="mb-5">
                            <input type="text" id="answer" name="answer" placeholder="Réponse" required minLength="1" size="15" className="border border-gray-400 p-2 rounded w-64 mb-2" />
                            <input type="submit" value="Valider" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 cursor-pointer" />
                        </form>
                    )}
                    {choicesVisible && (
                        <div id="rvBtnChoice" className="grid grid-cols-2 gap-4 mb-5">
                            {choices.map((choice, index) => (
                                <button key={index} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700" onClick={() => handleChoiceClick(choice)}>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="mb-5">
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={revealArtist}>Dévoiler l'artiste</button>
                        <div id="rvArtist" className="mt-2 text-lg" dangerouslySetInnerHTML={{ __html: showArtist ? artist : "" }}></div>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700" onClick={showChoices}>Choix multiple</button>
                    </div>
                </div>
            </div>
        </main>
    );
}