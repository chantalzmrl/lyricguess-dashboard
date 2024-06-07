import { useState, useEffect, useRef } from 'react';

export function useFetchLyrics(APIChan, musicId, initializedLyric) {
    const [lyrics, setLyrics] = useState({ entireLyric: '', halfLyric: ''});
    useEffect(() => {
        if (musicId && !initializedLyric.current) {
            const fetchLyric = async () => {
                try {
                    const response = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${APIChan}&track_id=${musicId}`);
                    const data = await response.json();
                    const entireLyric = data.message.body.lyrics.lyrics_body.replace(/\n/g, '<br/>').split("*******")[0];
                    const lyricSplited = entireLyric.split('<br/>');
                    const halfLyric = lyricSplited.slice(0, Math.ceil(lyricSplited.length / 2)).join('<br/>');
                    setLyrics({ entireLyric, halfLyric });
                } catch (error) {
                    console.error('Error fetching lyrics:', error);
                }
            };

            fetchLyric();
            initializedLyric.current = true;
        }
    }, [APIChan, musicId]);

    return lyrics;
}