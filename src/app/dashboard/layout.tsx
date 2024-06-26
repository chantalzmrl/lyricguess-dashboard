import TopNav from '@/app/ui/dashboard/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="grow p-6 md:overflow-y-auto md:p-12 flex flex-col items-center">{children}</div>
    </div>
  );
}