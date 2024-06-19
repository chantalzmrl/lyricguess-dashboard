'use client';

import { useState, useEffect, useRef } from 'react';
import { useFetchRandomMusic } from '../../components/useFetchRandomMusic';
import { useFetchLyrics } from '../../components/useFetchLyrics';
import EndGame from '@/app/ui/dashboard/endGame';

export default function Page() {
    const APIClem = "748abbee5cd03af50b25df7d90712004";
    const APIChan = "cc714dd978bb466ab1647a1930dab0eb";
    const APIChan2 = "fea0e303280abb2f95f0cec07585cc19";
    const APIChan3 = "4ac4dc543416ddc84a76fc91c72cd98e";

    let nbMancheUser: number;
    let TimeUser: number;

    if (typeof window !== "undefined") {
        nbMancheUser = parseInt(JSON.parse(localStorage.getItem("Manche") || "10"));
        TimeUser = parseInt(JSON.parse(localStorage.getItem("Timer") || "90"));
    } else {
        nbMancheUser = 10;
        TimeUser = 90;
    }

    const [ScoreTotal, setScoreTotal] = useState(0);
    const [ScoreManche, setScoreManche] = useState(100);
    const [nbManche, setNbManche] = useState(1);
    const [inputVisible, setInputVisible] = useState(true);
    const [choicesVisible, setChoicesVisible] = useState(false);
    const [choices, setChoices] = useState([]);
    const [manchesTitre, setManchesTitre] = useState([]);
    const [manchesArtist, setManchesArtist] = useState([]);
    const [manchesParole, setManchesParole] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [chosenAnswer, setChosenAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');

    const [triggerFetch, setTriggerFetch] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TimeUser);
    const [showEntireLyric, setShowEntireLyric] = useState(false);
    const [showArtist, setShowArtist] = useState(false);
    const [currentLyric, setCurrentLyric] = useState({ entireLyric: '', halfLyric: '' });
    const [gameOver, setGameOver] = useState(false);

    let initializedMusic = useRef(false);
    let initializedLyric = useRef(false);

    const percentageLeft = (timeLeft / TimeUser) * 100;

    const addMusic = (titre: string, artiste: string, parole: string) => {
        setManchesTitre([...manchesTitre, titre]);
        setManchesArtist([...manchesArtist, artiste]);
        setManchesParole([...manchesParole, parole]);
    };

    const { musicId, artist, title, tabTitles } = useFetchRandomMusic(APIChan2, triggerFetch, initializedMusic);
    const { entireLyric, halfLyric } = useFetchLyrics(APIChan2, musicId, initializedLyric);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(interval);
                    if (nbManche < nbMancheUser) {
                        setScoreManche(0);
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

    function validateAnswer(event: any) {
        event.preventDefault();
        const input = document.getElementById('answer')?.value;
        const inputHTML = document.getElementById('answer');
        if (inputHTML) {
            if (verifyAnswer(input, title)) {
                inputHTML.style.backgroundColor = '#67F587';
                setTimeout(() => {
                    if (nbManche < nbMancheUser) {
                    
                        generateNewMusic();
                    } else {
                        endGame();
                    }
                }, 1000);
            } else {
                inputHTML.style.backgroundColor = '#F5998B';
            }
        }
    }

    function verifyAnswer(input: string, title: string) {
        input = input.toLowerCase().split("(")[0].split("feat")[0].split("ft")[0].replaceAll(" ", "").replaceAll(/[^\w\s]/gi, '').replaceAll("REMIX", '').replaceAll("remix", '');
        title = title.toLowerCase().split("(")[0].split("feat")[0].split("ft")[0].replaceAll(" ", "").replaceAll(/[^\w\s]/gi, '').replaceAll("REMIX", '').replaceAll("remix", '');
        if (input === title) {
            return true;
        } else {
            return false;
        }
    }

    function revealArtist() {
        setShowArtist(true);
        setScoreManche(ScoreManche => ScoreManche - 20);
    }

    function addLyric() {
        setShowEntireLyric(true);
        setScoreManche(ScoreManche => ScoreManche - 30);
    }

    function showChoices() {
        setInputVisible(false);
        setChoicesVisible(true);
        setScoreManche(ScoreManche => ScoreManche - 40);
        setChoices(tabTitles);
    }

    function handleChoiceClick(choice: string) {
        setChosenAnswer(choice);
        setCorrectAnswer(title);

        setTimeout(() => {
            if (title === choice) {
                if (nbManche < nbMancheUser) {
                    generateNewMusic();
                } else {
                    endGame();
                }
            } else {

                if (nbManche < nbMancheUser) {
                    setScoreManche(0);
                    console.log(ScoreManche);
                    generateNewMusic();
                } else {
                    endGame();
                }
            }
        }, 1000);
    }

    function generateNewMusic() {
        let input = document.getElementById('answer')?.value;
        input = "";
        addMusic(title, artist, entireLyric);
        const inputHTML = document.getElementById('answer');
        if (inputHTML)
            inputHTML.style.backgroundColor = 'white';
        setInputVisible(true);
        setChoicesVisible(false);
        setChoices([]);
        setChosenAnswer('');
        setCorrectAnswer('');
        setScoreTotal(ScoreTotal => ScoreTotal + ScoreManche);
        setScoreManche(100);
        setNbManche(nbManche => nbManche + 1);

        initializedMusic.current = false;
        initializedLyric.current = false;

        setTriggerFetch(!triggerFetch);
        setTimeLeft(TimeUser);
        setShowEntireLyric(false);
        setShowArtist(false);
        setCurrentLyric({ entireLyric: '', halfLyric: '' });
    }

    function endGame() {
        setScoreTotal(ScoreTotal => ScoreTotal + ScoreManche);
        addMusic(title, artist, entireLyric);
        setGameOver(true);
    }

    function replay() {
        setScoreTotal(0);
        setScoreManche(100);
        setNbManche(1);
        setGameOver(false);
        setManchesTitre([]);
        setManchesArtist([]);
        setManchesParole([]);
        const inputHTML = document.getElementById('answer');
        if (inputHTML)
            inputHTML.style.backgroundColor = 'white';
        setInputVisible(true);
        setChoicesVisible(false);
        setChoices([]);
        setChosenAnswer('');
        setCorrectAnswer('');

        initializedMusic.current = false;
        initializedLyric.current = false;

        setTriggerFetch(!triggerFetch);
        setTimeLeft(TimeUser);
        setShowEntireLyric(false);
        setShowArtist(false);
        setCurrentLyric({ entireLyric: '', halfLyric: '' });
    }
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            {gameOver ? (
                <EndGame
                    score={ScoreTotal}
                    replay={replay}
                    titres={manchesTitre}
                    artistes={manchesArtist}
                    paroles={manchesParole}
                    time={TimeUser}
                    manches={nbMancheUser}
                />
            ) : (
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-yellow-600 mb-8">Partie en cours</h1>
                    <div className="flex justify-between w-full mb-8">
                        {isClient && (
                            <>
                                <p className="text-2xl font-semibold">Manche: {nbManche}</p>
                                <div className="mb-5 text-center w-120">
                                    <p className="text-xl">Temps restant : <b>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</b></p>
                                    <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
                                        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percentageLeft}%` }}></div>
                                    </div>
                                </div>
                                <p className="text-2xl font-semibold">Score: {ScoreTotal}</p>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="border-2 border-purple-500 rounded-lg p-6 min-w-142">
                            <div className="mb-5 text-center">
                                <p id="lyric" className="text-lg overflow-y-auto h-96 w-auto p-6" dangerouslySetInnerHTML={{ __html: showEntireLyric ? currentLyric.entireLyric : currentLyric.halfLyric }}></p>
                                <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700" onClick={addLyric}>Plus de paroles</button>
                            </div>
                        </div>
                        <div className="border-2 border-purple-500 rounded-lg p-6 min-w-142">
                            {inputVisible && (
                                <form onSubmit={validateAnswer} method="post" className="mb-5 flex justify-between">
                                    <input type="text" id="answer" name="answer" placeholder="Réponse" required minLength="1" size="15" className="border border-gray-400 p-2 rounded w-3/4 h-11  mr-2" />
                                    <input type="submit" value="Valider" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 cursor-pointer w-1/4 h-11 ml-2" />
                                </form>
                            )}
                            {choicesVisible && (
                                <div id="rvBtnChoice" className="grid grid-cols-2 gap-4 mb-5">
                                    {choices.map((choice, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 text-white rounded ${
                                                chosenAnswer
                                                    ? choice === correctAnswer
                                                        ? 'bg-green-500 hover:bg-green-700'
                                                        : choice === chosenAnswer
                                                        ? 'bg-red-500 hover:bg-red-700'
                                                        : 'bg-yellow-500 hover:bg-yellow-700'
                                                    : 'bg-yellow-500 hover:bg-yellow-700'
                                            }`}
                                            onClick={() => handleChoiceClick(choice)}
                                            disabled={chosenAnswer !== ''}
                                        >
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
                </div>
            )}
        </main>
    )
}