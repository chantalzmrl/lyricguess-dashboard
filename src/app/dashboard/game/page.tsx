'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { useRouter } from 'next/navigation';

export default function Page() {

    useEffect(() => {
        const fetchGenres = async () => {
          try {
            const response = await fetch('https://api.musixmatch.com/ws/1.1/music.genres.get?apikey=748abbee5cd03af50b25df7d90712004');
            const data = await response.json();
            const fetchedGenres = data.message.body.music_genre_list.map((genre: any) => ({
              id: genre.music_genre.music_genre_id,
              name: genre.music_genre.music_genre_name,
            }));
          } catch (error) {
            console.error('Error fetching genres:', error);
          }
        };
    
        fetchGenres();
      }, []);

    return (
        <main>
            <div>
                <p>jeu</p>
            </div>
        </main>
    );
}