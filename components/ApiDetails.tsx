import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Info, 
  Lock,
  ChevronDown, 
  ChevronRight,
  FileJson,
  Bookmark
} from 'lucide-react';

interface Parameter {
  name: string;
  in: string;
  schema: {
    type: string;
    description: string;
    examples?: string[];
    default?: boolean;
  };
}

interface ApiEndpoint {
  name: string;
  section: string;
  path: string;
  method: string;
  details: {
    security?: Array<Record<string, any>>;
    tags?: string[];
    summary?: string;
    description: string;
    parameters?: Parameter[];
    responses: Record<string, {
      description: string;
      content?: Record<string, any>;
    }>;
  };
}

const ApiDocumentationView = ({ endpoint }: { endpoint: ApiEndpoint }) => {
  const [activeSection, setActiveSection] = useState<string>('parameters');
  const [showParameters, setShowParameters] = useState(true);

  const getMethodColor = (method: string) => {
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
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        {/* Header Section */}
        <CardHeader className="border-b">
          <div className="flex flex-col space-y-4">
            {/* Method and Name */}
            <div className="flex items-center gap-3">
              <Badge className={`${getMethodColor(endpoint.method)} px-3 py-1 text-sm font-medium`}>
                {endpoint.method.toUpperCase()}
              </Badge>
              <CardTitle className="text-xl font-mono">{endpoint.name}</CardTitle>
            </div>
            
            {/* Tags */}
            {endpoint.details.tags && (
              <div className="flex flex-wrap gap-2">
                {endpoint.details.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Bookmark className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Path with copy button */}
            <div className="flex items-center gap-2 font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <Code size={18} className="text-gray-500" />
              <span className="text-sm flex-1">{endpoint.path}</span>
              {endpoint.details.security && (
                <Lock size={16} className="text-yellow-600" />
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400">
              {endpoint.details.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Parameters Tab */}
            <TabsContent value="parameters" className="space-y-4 mt-4">
              {endpoint.details.parameters && endpoint.details.parameters.length > 0 ? (
                <div className="space-y-4">
                  {endpoint.details.parameters.map((param) => (
                    <div 
                      key={param.name} 
                      className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-sm font-medium">{param.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {param.schema.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {param.in}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {param.schema.description}
                      </p>
                      {param.schema.examples && (
                        <div className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <div className="font-medium text-xs text-gray-500 mb-1">EXAMPLE</div>
                          <code className="text-sm">
                            {param.schema.examples[0]}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No parameters required
                </div>
              )}
            </TabsContent>

            {/* Responses Tab */}
            <TabsContent value="responses" className="space-y-4 mt-4">
              {Object.entries(endpoint.details.responses).map(([code, response]) => (
                <div 
                  key={code} 
                  className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      className={
                        code.startsWith('2') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {code}
                    </Badge>
                    <span className="text-sm font-medium">
                      {code.startsWith('2') ? 'Success' : 'Error'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {response.description}
                  </p>
                </div>
              ))}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-4">
              {endpoint.details.security ? (
                <div className="space-y-4">
                  {endpoint.details.security.map((scheme, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">
                          {Object.keys(scheme)[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Authentication required for this endpoint
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No authentication required
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentationView;