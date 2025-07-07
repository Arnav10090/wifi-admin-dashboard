"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Toaster, toast } from 'sonner';
import { FiLock, FiEye, FiEyeOff, FiSettings } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { usePermissions } from '@/hooks/usePermissions';

type SettingsData = {
  id: number;
  wifiPassword: string;
  wifiEnabled: boolean;
  firewallEnabled: boolean;
};

export default function SettingsClient({ settings: initialSettings }: { settings: SettingsData }) {
  const [settings, setSettings] = useState(initialSettings);
  const [showPassword, setShowPassword] = useState(false);
  const toastRef = useRef<string | number | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { hasPermission, loading } = usePermissions();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch role info from /api/auth/permissions (extend API if needed)
    async function fetchRole() {
      const res = await fetch('/api/auth/permissions');
      if (res.ok) {
        const data = await res.json();
        if (data.role && data.role.toLowerCase() === 'admin') setIsAdmin(true);
      }
    }
    fetchRole();
  }, []);

  const handleUpdate = async (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });

    if (res.ok) {
      let descriptionNode = null;
      if (field === 'firewallEnabled') {
        descriptionNode = (
          <span style={{ fontWeight: 'bold', color: '#111' }}>
            {value ? 'Successfully enabled Firewall.' : 'Successfully disabled Firewall.'}
          </span>
        );
      } else if (field === 'wifiEnabled') {
        descriptionNode = (
          <span style={{ fontWeight: 'bold', color: '#111' }}>
            {value ? 'Successfully enabled WiFi.' : 'Successfully disabled WiFi.'}
          </span>
        );
      } else {
        descriptionNode = (
          <span style={{ fontWeight: 'bold', color: '#111' }}>
            {`Successfully updated ${field}.`}
          </span>
        );
      }
      if (toastRef.current) toast.dismiss(toastRef.current);
      toastRef.current = toast.success(
        <span style={{ fontWeight: 'bold', color: '#111' }}>Settings updated</span>,
        {
          description: descriptionNode,
          duration: 3000,
        }
      );
    } else {
      if (field === 'wifiPassword' && res.status === 400) {
        const data = await res.json();
        if (data?.error?.includes('New password cannot be the same')) {
          if (toastRef.current) toast.dismiss(toastRef.current);
          toastRef.current = toast.error(
            <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed</span>,
            {
              description: <span style={{ fontWeight: 'bold', color: '#111' }}>{data.error}</span>,
              duration: 3000,
            }
          );
          return;
        }
      }
      if (toastRef.current) toast.dismiss(toastRef.current);
      let errorMsg: React.ReactNode = <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed</span>;
      let errorDesc: React.ReactNode = <span style={{ fontWeight: 'bold', color: '#111' }}>{`Could not update ${field}.`}</span>;
      if (res.status === 403 && field === 'wifiEnabled') {
        errorMsg = <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed!</span>;
        errorDesc = <span style={{ fontWeight: 'bold', color: '#111' }}>You do not have permission to change wifi status</span>;
      }
      if (res.status === 403 && field === 'firewallEnabled') {
        errorMsg = <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed!</span>;
        errorDesc = <span style={{ fontWeight: 'bold', color: '#111' }}>You do not have permission to change firewall status</span>;
      }
      toastRef.current = toast.error(errorMsg, {
        description: errorDesc,
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-8">
      <Toaster />
      <div className="w-full h-full flex-1 bg-white rounded-2xl shadow-lg p-6 mt-6 mb-6 ml-4 mr-4">
        {/* Router Settings Title with Icon */}
        <div className="flex items-center gap-2 mb-2">
          <FiSettings className="text-2xl" />
          <h2 className="text-2xl font-bold">Router Settings</h2>
        </div>
        {/* WiFi Password Card */}
        <Card className="rounded-2xl shadow p-8 mb-8">
          <div>
            <div className="text-xl font-semibold mb-4">WiFi Password</div>
            <hr className="mb-6" />
            <Label htmlFor="wifi-password" className="block mb-2 font-medium text-red-500">* WiFi Password</Label>
            <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 mb-6">
              <FiLock className="text-gray-400 mr-2" />
              <Input
                id="wifi-password"
                type={showPassword ? 'text' : 'password'}
                value={settings.wifiPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, wifiPassword: e.target.value }))}
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
            <Button onClick={() => handleUpdate('wifiPassword', settings.wifiPassword)} className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold cursor-pointer" disabled={!isAdmin}>
              Update Password
            </Button>
            {!isAdmin && (
              <div className="text-xs text-red-500 mt-2 font-semibold">Only admins can update the WiFi password.</div>
            )}
          </div>
        </Card>

        {/* Security Settings Card */}
        <Card className="rounded-2xl shadow p-8 mb-8">
          <div>
            <div className="text-xl font-semibold mb-4">Security Settings</div>
            <hr className="mb-6" />
            {/* WiFi Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <Label className="font-semibold text-base">WiFi</Label>
                <p className="text-sm text-gray-500">Enable or disable wireless network</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.wifiEnabled}
                  onCheckedChange={(checked) => handleUpdate('wifiEnabled', checked)}
                  className={`${settings.wifiEnabled ? 'bg-blue-500' : 'bg-gray-300'} cursor-pointer`}
                  disabled={!hasPermission('settings', 'update')}
                />
                <span className={`ml-2 text-base font-semibold ${settings.wifiEnabled ? 'text-blue-500' : 'text-gray-400'}`}>{settings.wifiEnabled ? 'On' : 'Off'}</span>
              </div>
            </div>
            <hr className="mb-8" />
            {/* Firewall Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold text-base">Firewall</Label>
                <p className="text-sm text-gray-500">Protect your network from unauthorized access</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.firewallEnabled}
                  onCheckedChange={(checked) => handleUpdate('firewallEnabled', checked)}
                  className={`${settings.firewallEnabled ? 'bg-blue-500' : 'bg-gray-300'} cursor-pointer`}
                  disabled={!hasPermission('settings', 'update')}
                />
                <span className={`ml-2 text-base font-semibold ${settings.firewallEnabled ? 'text-blue-500' : 'text-gray-400'}`}>{settings.firewallEnabled ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Card */}
        <Card className="rounded-2xl shadow p-8">
          <div>
            <div className="text-xl font-semibold mb-4">Account</div>
            <hr className="mb-8" />
            <div className="flex justify-center">
              <Button variant="destructive" className="px-12 py-3 text-lg font-bold rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer flex items-center gap-2 justify-center"
                onClick={async () => {
                  setLogoutLoading(true);
                  toast.success(<span style={{fontWeight: 'bold', color: '#111'}}>Logout Successful</span>, { description: <span style={{fontWeight: 'bold', color: '#111'}}>Visit again :)</span>, duration: 3000 });
                  await new Promise(r => setTimeout(r, 1000)); // allow toast to show loader
                  signOut({ callbackUrl: '/login' });
                }}
                disabled={logoutLoading}
              >
                {logoutLoading ? <span className="loader"></span> : null}
                <span className={logoutLoading ? 'text-sm' : ''}>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}