'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { useRouter } from 'next/navigation';

type Genre = {
  id: number;
  name: string;
};

const languageOptions = [
  { value: 'en', label: 'Anglais' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italien' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'pt', label: 'Portugais' },
  { value: 'ru', label: 'Russe' },
  { value: 'ja', label: 'Japonais' },
];

export default function Page() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedGenresId, setSelectedGenresId] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLanguageValues, setSelectedLanguageValues] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://api.musixmatch.com/ws/1.1/music.genres.get?apikey=748abbee5cd03af50b25df7d90712004');
        const data = await response.json();
        const fetchedGenres = data.message.body.music_genre_list.map((genre: any) => ({
          id: genre.music_genre.music_genre_id,
          name: genre.music_genre.music_genre_name,
        }));
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  //AJOUTER UN GENRE DE MUSIQUE
  const handleGenreSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenreId = parseInt(event.target.value, 10);
    const selectedGenre = genres.find(genre => genre.id === selectedGenreId);
    if (selectedGenre && !selectedGenres.some(genre => genre.id === selectedGenreId)) {
      setSelectedGenres([...selectedGenres, selectedGenre]);
      setSelectedGenresId([...selectedGenresId, selectedGenreId]);
    }
  };

  //AJOUTER UNE LANGUE
  const handleLanguageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguageValue = event.target.value;
    const selectedLanguage = languageOptions.find(option => option.value === selectedLanguageValue)?.label;
    if (selectedLanguage && !selectedLanguages.includes(selectedLanguage)) {
      setSelectedLanguages([...selectedLanguages, selectedLanguage]);
      setSelectedLanguageValues([...selectedLanguageValues, selectedLanguageValue]);
    }
  };

  //RETIRER UN GENRE DE MUSIQUE
  const handleGenreRemove = (genreToRemove: Genre) => {
    setSelectedGenres(selectedGenres.filter(genre => genre.id !== genreToRemove.id));
  };
  //RETIRER UNE LANGUE
  const handleLanguageRemove = (languageToRemove: string) => {
    setSelectedLanguages(selectedLanguages.filter(language => language !== languageToRemove));
  };

  //REDIRECTION
  const router = useRouter();
  const handleRedirect = () => {
    localStorage.setItem("Langues", JSON.stringify(selectedLanguageValues));
    localStorage.setItem("Genres", JSON.stringify(selectedGenresId));
    router.push('/dashboard/game');
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Filtres
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Choisis la langues des paroles de musiques</h2>
          <select onChange={handleLanguageSelect} className="p-2 border rounded mb-4">
        <option value="">Toutes les langues</option>
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
          <div>
            <h3 className="text-xl font-bold mb-2">Langues choisies</h3>
            <ul className="list-disc pl-4">
              {selectedLanguages.map((language, index) => (
                <li key={index}>
                  {language}
                  <button
                    onClick={() => handleLanguageRemove(language)}
                    className="ml-2 text-red-600"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Choisis les genres de musiques que tu veux</h2>
          <select onChange={handleGenreSelect} className="p-2 border rounded mb-4">
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <div>
            <h3 className="text-xl font-bold mb-2">Genres choisis</h3>
            <ul className="list-disc pl-4">
              {selectedGenres.map((genre) => (
                <li key={genre.id}>
                  {genre.name}
                  <button
                    onClick={() => handleGenreRemove(genre)}
                    className="ml-2 text-red-600"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <button onClick={handleRedirect} className="p-2 bg-blue-500 text-white rounded">
          Démarrer une partie
        </button>
      </div>
    </main>
  );
}