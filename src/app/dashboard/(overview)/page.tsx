// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
'use client';

import { useState, useEffect } from 'react';
import BestScores from '@/app/ui/dashboard/best-scores';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  BestScoresSkeleton,
  // CardsSkeleton,
} from '@/app/ui/skeletons';

export default function Page() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://api.musixmatch.com/ws/1.1/music.genres.get?apikey=748abbee5cd03af50b25df7d90712004');
        const data = await response.json();
        const fetchedGenres = data.message.body.music_genre_list.map((genre: any) => genre.music_genre.music_genre_name);
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = event.target.value;
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres([...selectedGenres, selectedGenre]);
    }
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Select Genres</h2>
          <select onChange={handleGenreSelect} className="p-2 border rounded mb-4">
            <option value="">Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
          <div>
            <h3 className="text-xl font-bold mb-2">Selected Genres</h3>
            <ul className="list-disc pl-4">
              {selectedGenres.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense> */}
        <Suspense fallback={<BestScoresSkeleton />}>
          <BestScores />
        </Suspense>
      </div>
    </main>
  );
}