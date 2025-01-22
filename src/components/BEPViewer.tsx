import React, { useState, useEffect } from 'react';
import { Clock, Terminal, Beaker, Info, AlertCircle, CheckCircle, XCircle, Code } from 'lucide-react';
import { FancyAnsi } from 'fancy-ansi';

interface BEPViewerProps {
  data: any[];
}

interface BuildMetadata {
  startTime: string;
  command: string;
  workspaceStatus: any;
  success: boolean;
  duration: number;
  builtTargets: string[];
}

interface TestResult {
  name: string;
  status: string;
  duration: number;
  logs?: string[];
}

export function BEPViewer({ data }: BEPViewerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metadata, setMetadata] = useState<BuildMetadata | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [expandedPaths, setExpandedPaths] = useState(new Set<string>());

  useEffect(() => {
    let startTime = '';
    let command = '';
    let workspaceStatus = null;
    let success = true;
    let endTime = '';
    const tests: TestResult[] = [];
    const logs: string[] = [];
    const targets: string[] = [];

    data.forEach(event => {
      if (event.started) {
        startTime = event.started.startTimeMillis
          ? new Date(parseInt(event.started.startTimeMillis)).toISOString()
          : event.started.startTime;
        command = event.started.command;
      }
      if (event.workspaceStatus) {
        workspaceStatus = event.workspaceStatus;
      }
      if (event.testResult) {
        tests.push({
          name: event.id.testResult.label,
          status: event.testResult.status,
          duration: event.testResult.testAttemptDuration?.seconds || 0,
          logs: event.testResult.testActionOutput || [],
        });
      }
      if (event.finished) {
        endTime = event.finished.finishTimeMillis
          ? new Date(parseInt(event.finished.finishTimeMillis)).toISOString()
          : event.finished.finishTime;
        success = event.finished.exitCode.name === "SUCCESS";
      }

      if (event.progress) {
        if (event.progress.stderr) {
          logs.push(event.progress.stderr);
        }
        if (event.progress.stdout) {
          logs.push(event.progress.stdout)
        }
      }
      
      if (event.id.targetCompleted && event.id.targetCompleted.label) {
        targets.push(event.id.targetCompleted.label);
      }
    });

    const duration =
      endTime && startTime
        ? (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
        : 0;

    setMetadata({ startTime, command, workspaceStatus, success, duration, builtTargets: targets });
    setTestResults(tests);
    setBuildLogs(logs);
  }, [data]);

  const togglePath = (path: string) => {
    const newPaths = new Set(expandedPaths);
    if (newPaths.has(path)) {
      newPaths.delete(path);
    } else {
      newPaths.add(path);
    }
    setExpandedPaths(newPaths);
  };

  const renderValue = (value: any, path: string = 'root'): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof value !== 'object') {
      return <span className="text-blue-600">{JSON.stringify(value)}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          {value.length === 0 ? (
            <span className="text-gray-500">[]</span>
          ) : (
            value.map((item, index) => (
              <div key={index}>
                {renderValue(item, `${path}.${index}`)}
              </div>
            ))
          )}
        </div>
      );
    }

    const isExpanded = expandedPaths.has(path);
    const keys = Object.keys(value);

    if (keys.length === 0) {
      return <span className="text-gray-500">{}</span>;
    }

    return (
      <div className="ml-4">
        <div
          className="flex items-center cursor-pointer hover:bg-gray-50 py-1"
          onClick={() => togglePath(path)}
        >
          <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
          <span className="font-medium">{path.split('.').pop()}</span>
          {!isExpanded && (
            <span className="ml-2 text-gray-500">
              {`{${keys.length} ${keys.length === 1 ? 'key' : 'keys'}}`}
            </span>
          )}
        </div>
        {isExpanded && (
          <div className="ml-4">
            {keys.map(key => (
              <div key={key} className="py-1">
                <span className="text-gray-700">{key}: </span>
                {renderValue(value[key], `${path}.${key}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Build Status</h2>
          {metadata?.success ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>Success</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="w-6 h-6 mr-2" />
              <span>Failed</span>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Command</p>
            <p className="font-mono text-sm">{metadata?.command}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p>{metadata ? `${Math.floor(metadata.duration / 60)}m ${Math.floor(metadata.duration % 60)}s` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Time</p>
            <p>{metadata?.startTime ? new Date(metadata.startTime).toLocaleString() : 'N/A'}</p>
          </div>
          {metadata?.workspaceStatus && (
            <div>
              <p className="text-sm text-gray-500">Workspace</p>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(metadata.workspaceStatus, null, 2)}
              </pre>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Targets Built</p>
            <pre className="text-sm overflow-auto">
              {metadata?.builtTargets.join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTests = () => (
    <div className="space-y-4">
      {testResults.map((test, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{test.name}</h3>
            <div className={`flex items-center ${
              test.status === 'PASSED' ? 'text-green-600' : 
              test.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {test.status === 'PASSED' ? <CheckCircle className="w-4 h-4 mr-1" /> :
               test.status === 'FAILED' ? <XCircle className="w-4 h-4 mr-1" /> :
               <AlertCircle className="w-4 h-4 mr-1" />}
              {test.status}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Duration: {test.duration}s
          </div>
          {test.logs && test.logs.length > 0 && (
            <div className="mt-2">
              <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
                {test.logs.join('\n')}
              </pre>
            </div>
          )}
        </div>
      ))}
      {testResults.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No test results found
        </div>
      )}
    </div>
  );
  
  const renderLogs = () => { 
    const fancyAnsi = new FancyAnsi();

    return (
      <div className="bg-white rounded-lg shadow">
        <div
          className="p-4 text-sm overflow-auto max-h-[600px] font-mono"
          dangerouslySetInnerHTML={{
            __html: buildLogs
              .map(log => fancyAnsi.toHtml(log)).join('<br />')
          }}
        ></div>
      </div>
    );
};

  const renderTiming = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-4">Build Timeline</h3>
        <div className="text-center text-gray-500 py-8">
          Timing information will be added in the next iteration
        </div>
      </div>
    </div>
  );

  const renderRaw = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="overflow-auto max-h-[600px] font-mono text-sm">
        {data.map((event, index) => (
          <div key={index} className="mb-4 pb-4 border-b border-gray-200">
            <div className="font-semibold mb-2">Event #{index + 1}</div>
            <pre className="ml-4 text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'tests', label: 'Tests', icon: Beaker },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'raw', label: 'Raw', icon: Code }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium border-b-2 
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tests' && renderTests()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'timing' && renderTiming()}
        {activeTab === 'raw' && renderRaw()}
      </div>
    </div>
  );
}
