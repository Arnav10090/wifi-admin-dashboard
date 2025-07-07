"use client"

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (result?.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('loginToastShown');
      }
      router.push('/dashboard');
    }
  };

  // Map roles to usernames
  const roleUsernames: Record<string, string> = {
    Admin: 'admin',
    Technician: 'technician',
    Guest: 'guest',
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Card className="w-[350px] shadow-2xl rounded-3xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">WiFi Admin Dashboard</CardTitle>
          <CardDescription className="text-gray-500">
            {selectedRole ? `Log in as ${selectedRole}` : 'Please select your role to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedRole ? (
            <div className="flex flex-col gap-4">
              <div className="text-center font-semibold mb-2 text-lg text-gray-700">Are you:</div>
              <Button className="w-full cursor-pointer bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-[1.03] transition-all duration-150 font-semibold rounded-xl py-2 shadow-sm" variant="outline" onClick={() => { setSelectedRole('Admin'); setUsername(roleUsernames['Admin']); }}>
                Admin
              </Button>
              <Button className="w-full cursor-pointer bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-[1.03] transition-all duration-150 font-semibold rounded-xl py-2 shadow-sm" variant="outline" onClick={() => { setSelectedRole('Technician'); setUsername(roleUsernames['Technician']); }}>
                Technician
              </Button>
              <Button className="w-full cursor-pointer bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-[1.03] transition-all duration-150 font-semibold rounded-xl py-2 shadow-sm" variant="outline" onClick={() => { setSelectedRole('Guest'); setUsername(roleUsernames['Guest']); }}>
                Guest
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} readOnly disabled />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center border rounded-xl px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-400">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="flex-1 border-0 bg-transparent focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <Button className="w-full mt-4 cursor-pointer" disabled={loading}>
                {loading ? <span className="loader mx-auto"></span> : 'Log in'}
              </Button>
              <Button type="button" className="w-full mt-2" variant="ghost" onClick={() => { setSelectedRole(null); setPassword(''); setError(''); }}>
                &larr; Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 