import { useState, useEffect } from 'react';
import { fetchBestScores } from '@/app/lib/data';
import {
  // CustomerField,
  // CustomersTableType,
  // InvoiceForm,
  // InvoicesTable,
  Score,
  User,
  Revenue,
} from '@/app/lib/definitions';

export default function BestScores() {
  const [scores, setScores] = useState<Score[]>([]); // Spécifier le type du state scores comme un tableau de Score

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await fetchBestScores();
        setScores(data);
      } catch (error) {
        console.error('Error fetching best scores:', error);
      }
    };

    fetchScores();
  }, []);

  const getMedaille = (index: any) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };

  return (
<div>
  <h1 className="text-2xl font-bold text-purple-700 text-center pb-8">Meilleurs scores</h1>
  <ul className="podium-list grid grid-cols-3 place-content-around place-items-center">
    {scores.slice(0, 3).map((score, index) => (
      <div key={index} className={`podium-item podium-${index + 1}`}>
        <span className="podium-medal">{getMedaille(index)}</span>
        {score.number}
      </div>
    ))}
  </ul>
</div>
  );
}