import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { FiWifi, FiShield, FiMonitor } from 'react-icons/fi'

type StatusCardProps = {
  title: string;
  value: string | number | boolean;
  isToggle?: boolean;
  onToggle?: (checked: boolean) => void;
};

const StatusCard = ({ title, value, isToggle = false, onToggle }: StatusCardProps) => {
  // Custom WiFi Status Card
  if (title === 'WiFi Status') {
    const enabled = Boolean(value);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-400 text-lg font-semibold">WiFi Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-6 mt-2">
              <FiWifi className={`text-3xl mr-2 ${enabled ? 'text-green-500' : 'text-red-400'}`} />
              <span className={`text-2xl font-bold ${enabled ? 'text-green-500' : 'text-red-400'}`}>{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              className={`cursor-pointer ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`ml-2 text-base font-semibold ${enabled ? 'text-blue-500' : 'text-gray-400'}`}>{enabled ? 'On' : 'Off'}</span>
            </Switch>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom Firewall Card
  if (title === 'Firewall') {
    const enabled = Boolean(value);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-400 text-lg font-semibold">Firewall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-6 mt-2">
              <span className="mr-2" style={{ width: '1.75rem', height: '1.75rem', display: 'inline-block' }}>
                {enabled ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L4 6V11C4 16.52 8.48 21.35 12 22C15.52 21.35 20 16.52 20 11V6L12 3Z" fill="#22C55E"/>
                    <path d="M9.5 12.5L11.5 14.5L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <FiShield className="text-3xl text-red-400" />
                )}
              </span>
              <span className={`text-2xl font-bold ${enabled ? 'text-green-500' : 'text-red-400'}`}>{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              className={`cursor-pointer ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`ml-2 text-base font-semibold ${enabled ? 'text-blue-500' : 'text-gray-400'}`}>{enabled ? 'On' : 'Off'}</span>
            </Switch>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom SSID Card
  if (title === 'SSID') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-400 text-lg font-semibold">SSID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-6 mt-2">
              <FiWifi className="text-3xl mr-2 text-black" />
              <span className="text-2xl font-bold text-black">{value}</span>
            </div>
            <span className="text-gray-400 text-base mt-2">Network Name</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom Connected Devices Card
  if (title === 'Connected Devices') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-400 text-lg font-semibold">Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-6 mt-2">
              <FiMonitor className="text-3xl mr-2 text-black" />
              <span className="text-2xl font-bold text-black">{value}</span>
            </div>
            <span className="text-gray-400 text-base mt-2">Active connections</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default Card
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isToggle ? (
          <div className="flex items-center space-x-2">
            <Switch checked={value as boolean} onCheckedChange={onToggle} className="cursor-pointer" />
            <span className={value ? "text-green-500" : "text-red-500"}>
              {value ? "Enabled" : "Disabled"}
            </span>
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard; 