import React, { useState, useCallback } from 'react';
import { FileUp, AlertCircle } from 'lucide-react';
import { load, Reader } from 'protobufjs';
import { BEPViewer } from './components/BEPViewer';
import { DropZone } from './components/DropZone';

function App() {
  const [bepData, setBepData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const root = await load('/build_event_stream.proto');
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) return;
          const buffer = e.target.result as ArrayBuffer;
          const BEPMessage = root.lookupType('build_event_stream.BuildEvent');
          const uint8Array = new Uint8Array(buffer);
          const messages: any[] = [];
          
          let protoReader = new Reader(uint8Array);
          while (protoReader.pos < protoReader.len) {
            const message = BEPMessage.decodeDelimited(protoReader);
            messages.push(message.toJSON());
          }

          setBepData(messages);
        } catch (err) {
          setError(`Failed to parse the BEP file: ${err instanceof Error ? err.message : 'Unknown error'}. Please ensure it's a valid Build Event Protocol file.`);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(`Failed to load the proto definition: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <FileUp className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Bazel BEP Viewer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {bepData.length === 0 ? (
          <DropZone onFile={handleFile} />
        ) : (
          <BEPViewer data={bepData} />
        )}
      </main>
    </div>
  );
}

export default App;