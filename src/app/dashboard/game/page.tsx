'use client';

import { useState, useEffect, useRef } from 'react';
import { useFetchRandomMusic } from '../../components/useFetchRandomMusic';
import { useFetchLyrics } from '../../components/useFetchLyrics';

export default function Page() {
    const APIClem = "748abbee5cd03af50b25df7d90712004";
    const APIChan = "cc714dd978bb466ab1647a1930dab0eb";
    const APIChan2 = "fea0e303280abb2f95f0cec07585cc19";
    const APIChan3 = "4ac4dc543416ddc84a76fc91c72cd98e";

    let ScoreTotal: number = 0;
    let ScoreManche: number = 100;
    let initializedMusic = useRef(false);
    let initializedLyric = useRef(false);

    const [triggerFetch, setTriggerFetch] = useState(false); // État pour déclencher une nouvelle fetch
    const [timeLeft, setTimeLeft] = useState(90);
    const [showEntireLyric, setShowEntireLyric] = useState(false);
    const [currentLyric, setCurrentLyric] = useState({ entireLyric: '', halfLyric: '' });

    const { musicId, artist, title} = useFetchRandomMusic(APIChan3, triggerFetch, initializedMusic);
    const { entireLyric, halfLyric } = useFetchLyrics(APIChan3, musicId, initializedLyric);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
        console.log(title);
        console.log(input);
        if(inputHTML)
        if (input === title) {
            inputHTML.style.backgroundColor = '#69E688';
            ScoreTotal += ScoreManche;
            ScoreManche = 0;
            initializedMusic.current = false;
            initializedLyric.current = false;
            generateNewMusic();
        }else{
            inputHTML.style.backgroundColor = '#E36032';
        }
    }

    function revealeArtist() {
        const pArtist = document.getElementById("rvArtist");
        if (pArtist) pArtist.textContent = artist;
    }

    function addLyric() {
        setShowEntireLyric(true);

    }

    function generateNewMusic() {
        setTriggerFetch(!triggerFetch);
        setTimeLeft(90);
        setShowEntireLyric(false);
        setCurrentLyric({ entireLyric: '', halfLyric: '' });
    }

    return (
        <main>
            <div>
                <p>jeu</p>
                <p>paroles</p>
                <div>
                    <p>Temps restant : {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    <div style={{
                        width: '100%',
                        height: '20px',
                        backgroundColor: 'lightgray',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginTop: '10px'
                    }}>
                        <div style={{
                            width: `${percentageLeft}%`,
                            height: '100%',
                            backgroundColor: 'green',
                            transition: 'width 1s linear'
                        }}></div>
                    </div>
                </div>
                <br></br>
                <p id="lyric" dangerouslySetInnerHTML={{ __html: showEntireLyric ? currentLyric.entireLyric : currentLyric.halfLyric }}></p>
                <button onClick={addLyric}>Plus de paroles</button>
                <form onSubmit={validateAnswer} method="post">
                    <input type="text" id="answer" name="answer" placeholder="réponse" required minLength="1" size="15" />
                    <input type="submit" value="valider" />
                </form>
            </div>
            <div>
                <button onClick={revealeArtist}>dévoiler l'artiste</button>
                <div id="rvArtist"></div>
            </div>
        </main>
    );
}