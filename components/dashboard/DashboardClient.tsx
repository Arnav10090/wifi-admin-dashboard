"use client";

import { useEffect, useState, useRef } from 'react';
import StatusCard from '@/components/dashboard/StatusCard';
import NetworkInfo from '@/components/dashboard/NetworkInfo';
import ConnectedDevices from '@/components/dashboard/ConnectedDevices';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

// Types to match the API responses
type Stats = {
  wifiStatus: boolean;
  firewallStatus: boolean;
  ssid: string;
  connectedDevices: number;
};

type NetworkInfoData = {
  ssid: string;
  securityType: string;
  channel: number;
  frequency: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
};

type Device = {
  id: number;
  name: string;
  ipAddress: string;
  macAddress: string;
  connectionType: string;
  status: string;
};

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const toastRef = useRef<string | number | null>(null);
  const { hasPermission, loading } = usePermissions();
  const loginToastShownRef = useRef(false);

  useEffect(() => {
    // Show role-specific login toast only on first dashboard load after login
    if (
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('loginToastShown') &&
      !loginToastShownRef.current
    ) {
      fetch('/api/auth/permissions')
        .then(res => res.json())
        .then(data => {
          if (data.role) {
            const role = data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase();
            if (toastRef.current) toast.dismiss(toastRef.current);
            toastRef.current = toast.success(
              <span style={{ fontWeight: 'bold', color: '#111' }}>Logged in successfully as {role}, welcome to the dashboard</span>,
              { duration: 3500 }
            );
            sessionStorage.setItem('loginToastShown', 'true');
            loginToastShownRef.current = true;
          }
        });
    }
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(error => {
        console.error('Error fetching stats:', error);
        setStats(null);
      });
    fetch('/api/dashboard/network-info')
      .then(res => res.json())
      .then(setNetworkInfo)
      .catch(error => {
        console.error('Error fetching network info:', error);
        setNetworkInfo(null);
      });
    fetch('/api/dashboard/devices')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched devices:', data);
        // Ensure devices is always an array
        const devicesArray = Array.isArray(data.devices) ? data.devices : [];
        setDevices(devicesArray);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setDevices([]); // Fallback to empty array on error
      });
  }, []);

  const handleToggle = async (field: 'wifiStatus' | 'firewallStatus', value: boolean) => {
    if (!stats) return;
    if (toastRef.current) toast.dismiss(toastRef.current);
    const prevStats = { ...stats };
    setStats({ ...stats, [field]: value });
    const apiField = field === 'wifiStatus' ? 'wifiEnabled' : 'firewallEnabled';
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [apiField]: value }),
    });
    if (res.ok) {
      let descriptionNode = null;
      if (field === 'wifiStatus') {
        descriptionNode = (
          <span style={{ fontWeight: 'bold', color: '#111' }}>
            {value ? 'Successfully enabled WiFi.' : 'Successfully disabled WiFi.'}
          </span>
        );
      } else {
        descriptionNode = (
          <span style={{ fontWeight: 'bold', color: '#111' }}>
            {value ? 'Successfully enabled Firewall.' : 'Successfully disabled Firewall.'}
          </span>
        );
      }
      toastRef.current = toast.success(
        <span style={{ fontWeight: 'bold', color: '#111' }}>Settings updated</span>,
        {
          description: descriptionNode,
          duration: 3000,
        }
      );
    } else {
      setStats(prevStats);
      let errorMsg: React.ReactNode = <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed</span>;
      let errorDesc: React.ReactNode = <span style={{ fontWeight: 'bold', color: '#111' }}>{`Could not update ${field}.`}</span>;
      if (res.status === 403 && field === 'wifiStatus') {
        errorMsg = <span style={{ fontWeight: 'bold', color: '#111' }}>Update failed!</span>;
        errorDesc = <span style={{ fontWeight: 'bold', color: '#111' }}>You do not have permission to change wifi status</span>;
      }
      if (res.status === 403 && field === 'firewallStatus') {
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
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="max-w-[77rem] mx-auto h-full bg-white rounded-2xl shadow p-6 mt-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatusCard
            title="WiFi Status"
            value={stats?.wifiStatus ?? false}
            isToggle
            onToggle={checked => handleToggle('wifiStatus', checked)}
          />
          <StatusCard
            title="Firewall"
            value={stats?.firewallStatus ?? false}
            isToggle
            onToggle={checked => handleToggle('firewallStatus', checked)}
          />
          <StatusCard title="SSID" value={stats?.ssid ?? ''} />
          <StatusCard title="Connected Devices" value={devices.length} />
        </div>
        <hr className="border-t border-gray-200 my-6" />
        <NetworkInfo info={networkInfo} />
        <hr className="border-t border-gray-200 my-6" />
        <ConnectedDevices devices={devices} />
      </div>
    </div>
  )
} 