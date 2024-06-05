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

  return (
    <div>
      <h2>Best Scores</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.number}</li>
        ))}
      </ul>
    </div>
  );
}