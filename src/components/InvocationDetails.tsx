import React from 'react';
import { XCircle, CheckCircle, Clock, User, Server, Package, Grid, Settings, CloudOff, Cloud, Play } from 'lucide-react';

interface InvocationDetailsProps {
  pass: boolean;
  duration: number;
  user: string;
  cpu: string;
  hostname: string;
  target: string;
  numTargets: number;
  numPackages: number;
  numFetches: number;
  remoteExecution: boolean;
  caching: boolean;
}

const CpuIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       className="icon">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <path d="M15 2v2"></path>
        <path d="M15 20v2"></path>
        <path d="M2 15h2"></path>
        <path d="M2 9h2"></path>
        <path d="M20 15h2"></path>
        <path d="M20 9h2"></path>
        <path d="M9 2v2"></path>
        <path d="M9 20v2"></path>
  </svg>

const FetchIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       className="icon">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path>
  </svg>

const InvocationDetails: React.FC<InvocationDetailsProps> = ({
  pass,
  duration,
  user,
  cpu,
  hostname,
  target,
  numTargets,
  numPackages,
  numFetches,
  remoteExecution,
  caching,
}) => {
  const details = [
    { icon: pass ? CheckCircle : XCircle, text: pass ? 'Passed' : 'Failed', className: pass ? 'text-green-600' : 'text-red-600' },
    { icon: Clock, text: `${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`, tooltip: 'Duration' },
    { icon: User, text: user, tooltip: 'User' },
    { icon: Server, text: hostname, tooltip: 'Hostname' },
    { icon: Grid, text: target, tooltip: 'Target path' },
    { icon: CpuIcon, text: cpu, tooltip: 'CPU' },
    { icon: Settings, text: `${numTargets} targets`, tooltip: 'Number of configured targets' },
    { icon: Package, text: `${numPackages} packages`, tooltip: 'Number of packages' },
    { icon: FetchIcon, text: `${numFetches} fetches`, tooltip: 'Number of fetches', isActive: numFetches > 0 },
    { icon: remoteExecution ? Cloud : CloudOff, text: `Remote execution ${remoteExecution ? "on" : "off"}` },
    { icon: Cloud, text: caching ? 'Caching on' : 'Caching off', isActive: caching },
  ];

  return (
    <div className="details grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {details.map((detail, index) => (
        <div key={index} className="detail flex items-center space-x-2">
          <detail.icon className={`icon w-6 h-6 ${detail.className}`} />
          <span className="text-gray-800" title={detail.tooltip || ''}>
            {detail.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default InvocationDetails;