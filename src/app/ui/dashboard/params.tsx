import { useEffect, useState } from 'react';

export async function getServerSideProps() {
  const fetchGenres = async () => {
    try {
      const response = await fetch('https://api.musixmatch.com/ws/1.1/music.genres.get?apikey=748abbee5cd03af50b25df7d90712004');
      const data = await response.json();
      return data.message.body.music_genre_list.map((genre: any) => genre.music_genre.music_genre_name);
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  };

  const genres = await fetchGenres();

  return { props: { genres } };
}

export default function GenreSelector({ genres }: { genres: string[] }) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleGenreSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = event.target.value;
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres([...selectedGenres, selectedGenre]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Select Genres</h2>
      <select onChange={handleGenreSelect} className="p-2 border rounded mb-4">
        <option value="">Select a genre</option>
        {genres.map((genre: any, index: any) => (
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
  );
}