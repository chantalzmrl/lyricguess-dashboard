import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function TopNav() {
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
          </Link>
          <NavLinks />
        </div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex items-center gap-2 rounded-md bg-gray-50 p-2 text-sm font-medium text-gray-800 hover:bg-sky-100 hover:text-blue-600">
            <PowerIcon className="w-6" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  );
}