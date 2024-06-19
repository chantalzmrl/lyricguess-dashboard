import { useState, useEffect, useRef } from 'react';

export function useFetchRandomMusic(API, triggerFetch, initializedMusic) {
    const [musicData, setMusicData] = useState({ musicId: null, artist: '', title: '', tabTitles: [] });
    // const [tryFetch, setTry] = useState(0);
    let tryFetch = 0;
    useEffect(() => {
        if (!initializedMusic.current) {
            const fetchRandomMusic = async () => {
                try {
                    let lyricLanguage = JSON.parse(localStorage.getItem("Langues") || []);
                    let genre = JSON.parse(localStorage.getItem("Genres") || []);
                    console.log(genre);
                    console.log(lyricLanguage);

                    const randomGenre = Math.floor(Math.random() * genre.length);
                    const randomlyricLanguage = Math.floor(Math.random() * (lyricLanguage.length));
                    console.log(randomGenre);
                    console.log(randomlyricLanguage);
                    const string = createRandomString(1);
                    let url = `https://api.musixmatch.com/ws/1.1/track.search?apikey=${API}&f_has_lyrics=1&page_size=100&f_has_rich_sync=1&s_track_rating=desc&q=${string}`;
                    if (genre.length > 0) {
                        url += `&f_music_genre_id=${genre[randomGenre]}`;
                    }
                    if (lyricLanguage.length > 0) {
                        console.log("CA MARCHE");
                        url += `&f_lyrics_language=${lyricLanguage[randomlyricLanguage]}`;
                    }
                    console.log(url);
                    const response = await fetch(url);
                    const data = await response.json();
                    const tracks = data.message.body.track_list;
                    if (tracks.length > 0) {
                        const randomNumber = Math.floor(Math.random() * tracks.length - 4);
                        console.log(tracks[randomNumber]);
                        // if (tracks[randomNumber].has_lyrics == "1") {

                            const randomTrack = tracks[randomNumber].track;
                            console.log(tracks[randomNumber].track);
                            let tab = [tracks[randomNumber].track.track_name, tracks[randomNumber + 1].track.track_name, tracks[randomNumber + 2].track.track_name, tracks[randomNumber + 3].track.track_name]
                            let tabMixed = mixTab(tab);
                            console.log(tabMixed);
                            setMusicData({ musicId: randomTrack.track_id, artist: randomTrack.artist_name, title: randomTrack.track_name, tabTitles: tabMixed });
                        // } else {
                        //     tryFetch += 1;
                        //     if (tryFetch < 5) {
                        //         return fetchRandomMusic();
                        //     }
                        //     return fetchRandomMusic();
                        // }
                    } else {
                        console.log('No tracks found');
                    }
                } catch (error) {
                    tryFetch += 1;
                    if (tryFetch < 5) {
                        return fetchRandomMusic();
                    } else {
                        console.error('Error fetching:', error);
                    }
                }
            };
            fetchRandomMusic();
            initializedMusic.current = true;
        }
    }, [API, triggerFetch]);

    return musicData;
}

function createRandomString(length) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function mixTab(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}