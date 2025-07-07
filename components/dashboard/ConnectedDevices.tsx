import { FiMonitor } from 'react-icons/fi';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

type Device = {
  id: number;
  name: string;
  ipAddress: string;
  macAddress: string;
  connectionType: string;
  status: string;
};

type ConnectedDevicesProps = {
  devices: Device[];
};

const ConnectedDevices = ({ devices }: ConnectedDevicesProps) => {
  const [deviceStates, setDeviceStates] = useState<Device[]>([]);
  const toastRef = useRef<string | number | null>(null);
  const { hasPermission, loading } = usePermissions();

  useEffect(() => {
    // Ensure devices is always an array before mapping
    const devicesArray = Array.isArray(devices) ? devices : [];
    setDeviceStates(devicesArray.map(d => ({ ...d })));
  }, [devices]);

  const handleToggle = async (device: Device, checked: boolean) => {
    try {
      // Dismiss previous toast if exists
      if (toastRef.current) toast.dismiss(toastRef.current);

      const res = await fetch('/api/dashboard/devices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: device.id, status: checked ? 'Connected' : 'Disconnected' })
      });
      if (res.ok) {
        setDeviceStates(prev => prev.map(d => d.id === device.id ? { ...d, status: checked ? 'Connected' : 'Disconnected' } : d));
        toastRef.current = toast.success(
          `${device.name} ${checked ? 'connected' : 'disconnected'}`,
          { duration: 3000 }
        );
      } else {
        toastRef.current = toast.error('Failed to update device status', { duration: 3000 });
      }
    } catch (e) {
      toastRef.current = toast.error('Failed to update device status', { duration: 3000 });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 ml-1">
        <FiMonitor className="text-xl mr-2" />
        <span className="text-xl font-semibold">Connected Devices</span>
      </div>
      <div className="bg-white rounded-2xl border p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left font-bold">Device Name</th>
              <th className="px-6 py-3 text-left font-bold">IP Address</th>
              <th className="px-6 py-3 text-left font-bold">MAC Address</th>
              <th className="px-6 py-3 text-left font-bold">Connection Type</th>
              <th className="px-6 py-3 text-left font-bold">Connection Status</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(deviceStates) ? deviceStates : []).map((device) => (
              <tr key={device.id} className="border-t">
                <td className="px-6 py-3 flex items-center gap-2">
                  <FiMonitor className="inline-block mr-2 text-gray-500" />
                  {device.name}
                </td>
                <td className="px-6 py-3">{device.ipAddress}</td>
                <td className="px-6 py-3">{device.macAddress}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      device.connectionType === 'Wireless'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-green-50 text-green-600 border-green-200'
                    }`}
                  >
                    {device.connectionType}
                  </span>
                </td>
                <td className="px-6 py-3 flex justify-start ml-10">
                  {!loading && hasPermission('devices', 'update') ? (
                    <Switch
                      checked={device.status === 'Connected'}
                      onCheckedChange={checked => handleToggle(device, checked)}
                      className={
                        `${device.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'} cursor-pointer`
                      }
                    />
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      device.status === 'Connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConnectedDevices; 