"use client";

import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FiUser, FiChevronDown, FiLogOut, FiWifi } from 'react-icons/fi';
import { toast } from 'sonner';
import { useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const title = pathname.split('/').pop();
  const formattedTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Dashboard';

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">{pathname.includes('/settings') ? 'Router Settings' : 'Router Dashboard'}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <button
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer border-none"
            style={{ transition: '0.3s' }}
          >
            <FiUser className="text-xl" />
            <span className="font-medium">{session?.user?.name || 'admin'}</span>
            <FiChevronDown className="text-lg cursor-pointer" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl shadow-lg mt-2 p-0 w-40">
          <button
            onClick={async () => {
              setLogoutLoading(true);
              toast.success(<span style={{fontWeight: 'bold', color: '#111'}}>Logout Successful</span>, { description: <span style={{fontWeight: 'bold', color: '#111'}}>Visit again :)</span>, duration: 3000 });
              await new Promise(r => setTimeout(r, 1000)); // allow toast to show loader
              signOut({ callbackUrl: '/login' });
            }}
            disabled={logoutLoading}
            className="flex items-center gap-2 w-full px-6 py-3 text-lg text-red-500 font-semibold rounded-xl hover:bg-red-50 focus:outline-none transition-colors cursor-pointer justify-center"
          >
            {logoutLoading ? <span className="loader"></span> : <FiLogOut className="text-xl" />}
            <span className={logoutLoading ? 'text-sm' : ''}>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header; 