import { useState, useEffect, useRef } from 'react';

export function useFetchRandomMusic(API, triggerFetch, initializedMusic) {
    const [musicData, setMusicData] = useState({ musicId: null, artist: '', title: '', tabTitles: []});
    useEffect(() => {
        if (!initializedMusic.current) {
        const fetchRandomMusic = async () => {
            try {
                let lyricLanguage = JSON.parse(localStorage.getItem("Langues") || []);
                let genre = JSON.parse(localStorage.getItem("Genres") || []);
                console.log(genre);
                console.log(lyricLanguage);

                const randomGenre = Math.floor(Math.random() * genre.length);
                const randomlyricLanguage = Math.floor(Math.random() * lyricLanguage.length);
                console.log(randomGenre);
                console.log(randomlyricLanguage);
                const string = createRandomString(1);
                const url = `https://api.musixmatch.com/ws/1.1/track.search?apikey=${API}&f_has_lyrics&page_size=100&f_has_rich_sync=1&s_track_rating=desc&q=${string}`;
                if(lyricLanguage.length > 0){
                    url + `&f_music_genre_id=${genre[randomGenre]}`;
                }
                if(genre.length > 0){
                    url + `&f_lyrics_language=${lyricLanguage[randomlyricLanguage]}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                const tracks = data.message.body.track_list;
                if (tracks.length > 0) {
                    const randomNumber = Math.floor(Math.random() * tracks.length);
                    const randomTrack = tracks[randomNumber].track;
                    let tab = [tracks[randomNumber].track.track_name, tracks[randomNumber+1].track.track_name, tracks[randomNumber+2].track.track_name, tracks[randomNumber+3].track.track_name]
                    setMusicData({ musicId: randomTrack.track_id, artist: randomTrack.artist_name, title: randomTrack.track_name , tabTitles: tab});
                } else {
                    console.log('No tracks found');
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
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