"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings } from 'lucide-react';
import { FiWifi } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-blue-100 min-h-screen flex flex-col py-8 px-0">
      <div className="px-8 mb-8 flex items-center gap-2">
        <FiWifi className="text-2xl text-blue-500" />
        <span className="text-2xl font-bold text-blue-800">WiFi Admin</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <div
                  className={`flex items-center px-8 py-3 rounded-lg text-lg font-medium transition-colors cursor-pointer ${
                    pathname === item.href
                      ? 'bg-blue-200 text-blue-700'
                      : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="mr-3" />
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 