'use client';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import BestScores from '@/app/ui/dashboard/best-scores';
import { lusitana } from '@/app/ui/fonts';
import {
  RevenueChartSkeleton,
  BestScoresSkeleton,
  // CardsSkeleton,
} from '@/app/ui/skeletons';

export default function Page() {
  const router = useRouter();

  const handleRedirect = () => {
    console.log("OUI");
    router.push('/dashboard/filters'); // Remplacez '/filters' par le chemin de destination
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense> */}
        <Suspense fallback={<BestScoresSkeleton />}>
          <BestScores />
        </Suspense>
      </div>
      <div>
        <button onClick={handleRedirect} className="p-2 bg-blue-500 text-white rounded">
          Démarrer une partie
        </button>
      </div>
    </main>
  );
}