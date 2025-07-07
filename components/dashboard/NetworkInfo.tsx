import { FiWifi } from 'react-icons/fi';

type NetworkInfoProps = {
  info: {
    ssid: string;
    securityType: string;
    channel: number;
    frequency: string;
    ipAddress: string;
    subnetMask: string;
    gateway: string;
    dns: string;
  } | null;
};

const NetworkInfo = ({ info }: NetworkInfoProps) => {
  if (!info) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 ml-1">
        <FiWifi className="text-xl mr-2" />
        <span className="text-xl font-semibold">Network Information</span>
      </div>
      <div className="bg-white rounded-2xl border p-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-1"><span className="font-bold">SSID:</span> {info.ssid}</p>
            <p className="mb-1"><span className="font-bold">Security Type:</span> {info.securityType}</p>
            <p className="mb-1"><span className="font-bold">Channel:</span> {info.channel}</p>
            <p className="mb-1"><span className="font-bold">Frequency:</span> {info.frequency}</p>
          </div>
          <div>
            <p className="mb-1"><span className="font-bold">IP Address:</span> {info.ipAddress}</p>
            <p className="mb-1"><span className="font-bold">Subnet Mask:</span> {info.subnetMask}</p>
            <p className="mb-1"><span className="font-bold">Gateway:</span> {info.gateway}</p>
            <p className="mb-1"><span className="font-bold">DNS:</span> {info.dns}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkInfo; 