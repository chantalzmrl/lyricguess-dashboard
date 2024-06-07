import { useState, useEffect, useRef } from 'react';

export function useFetchRandomMusic(APIChan, triggerFetch, initializedMusic) {
    const [musicData, setMusicData] = useState({ musicId: null, artist: '', title: ''});
    useEffect(() => {
        if (!initializedMusic.current) {
        const fetchRandomMusic = async () => {
            try {
                const string = createRandomString(1);
                const response = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?apikey=${APIChan}&f_has_lyrics&page_size=100&f_has_rich_sync=1&f_lyrics_language=fr&s_track_rating=desc&q=${string}`);
                const data = await response.json();

                const tracks = data.message.body.track_list;
                if (tracks.length > 0) {
                    const randomNumber = Math.floor(Math.random() * tracks.length);
                    const randomTrack = tracks[randomNumber].track;
                    setMusicData({ musicId: randomTrack.track_id, artist: randomTrack.artist_name, title: randomTrack.track_name });
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
    }, [APIChan, triggerFetch]);

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