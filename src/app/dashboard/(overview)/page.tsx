'use client';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import BestScores from '@/app/ui/dashboard/best-scores';
import { lusitana } from '@/app/ui/fonts';
import {
    BestScoresSkeleton,
} from '@/app/ui/skeletons';

export default function Page() {
    const router = useRouter();
    const [showRules, setShowRules] = useState(false);
    const toggleRules = () => setShowRules(!showRules);

    const handleRedirect = () => {
        router.push('/dashboard/filters'); // Remplacez '/filters' par le chemin de destination
    };

    return (
        <main className="p-5 w-3/4 mx-auto">
            <h1 className="text-3xl font-extrabold text-purple-900 text-center">LYRIC GUESS</h1>
            <div className="container mx-auto text-white">

                {showRules && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white p-5 rounded-lg shadow-lg text-gray-900">
                            <h3 className="text-xl font-bold mb-4">Règles du jeu</h3>
                            <p>Lyric Guess est un jeu de devinettes où vous devez identifier les titres des chansons basés
                                sur des extraits de paroles.</p>
                            <ul className="list-disc pl-5">
                                <li>Chaque bonne réponse vous donne des points.</li>
                                <li>Utilisez des indices si vous êtes bloqué.</li>
                                <li>Le nombre de points diminue avec chaque indice utilisé.</li>
                                <li>Essayez de deviner le titre avant la fin du chronomètre pour maximiser vos points.</li>
                            </ul>
                            <button
                                onClick={toggleRules}
                                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded transition duration-200"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-8 w-120">
                <Suspense fallback={<BestScoresSkeleton />}>
                    <div className="p-4 text-xl text-gray-800">
                        <BestScores />
                    </div>
                </Suspense>
            </div>
            <div className="flex justify-center mt-16 space-x-4">
                <button
                    onClick={toggleRules}
                    className="bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-2xl px-8 py-4"
                >
                    Voir les règles du jeu
                </button>
                <button
                    onClick={handleRedirect}
                    className="bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-2xl px-8 py-4"
                >
                    Démarrer une partie
                </button>
            </div>
        </main>
    );
}