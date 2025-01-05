import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Code, Info, FileJson } from 'lucide-react';

interface ApiEndpoint {
  method: string;
  name: string;
  description: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
  responses: Record<string, string>;
}

const ApiDetailView = ({ endpoint }: { endpoint: ApiEndpoint }) => {
    console.log(endpoint);
    console.table(endpoint);
  const [showHeaders, setShowHeaders] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showParams, setShowParams] = useState(false);

  const getMethodColor = (method: String) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3 mb-2">
          <Badge className={`${getMethodColor(endpoint.method)} px-3 py-1 text-sm font-medium`}>
            {endpoint.method}
          </Badge>
          <CardTitle className="text-lg font-mono">{endpoint.name}</CardTitle>
        </div>
        <CardDescription className="text-base">
          {endpoint.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <Code size={18} />
            <span className="text-sm">{endpoint.path}</span>
          </div>

          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4 mt-4">
              {/* Headers Section */}
              {endpoint.headers && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowHeaders(!showHeaders)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Info size={18} />
                      <span className="font-medium">Headers</span>
                    </div>
                    {showHeaders ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  {showHeaders && (
                    <div className="p-3 font-mono text-sm">
                      {Object.entries(endpoint.headers).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4 mb-2">
                          <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Body Section */}
              {endpoint.body && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowBody(!showBody)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileJson size={18} />
                      <span className="font-medium">Request Body</span>
                    </div>
                    {showBody ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  {showBody && (
                    <div className="p-3">
                      <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
                        <code className="text-sm">
                          {JSON.stringify(endpoint.body, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Query Parameters Section */}
              {endpoint.queryParams && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowParams(!showParams)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Code size={18} />
                      <span className="font-medium">Query Parameters</span>
                    </div>
                    {showParams ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  {showParams && (
                    <div className="p-3">
                      {Object.entries(endpoint.queryParams).map(([key, description]) => (
                        <div key={key} className="mb-3">
                          <div className="font-medium text-sm">{key}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="response" className="mt-4">
              <div className="space-y-4">
                {Object.entries(endpoint.responses).map(([code, description]) => (
                  <div key={code} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={code.startsWith('2') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {code}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDetailView;