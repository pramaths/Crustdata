import React from 'react';
import { CheckCircle, AlertCircle, Copy, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeBlock = ({ code, language = 'json' }: { code: string; language?: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative rounded-lg bg-gray-800 p-3 my-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
      <pre className="text-xs text-green-400 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface ApiResponseProps {
  status: number;
  response: any;
  endpoint: string;
  method: string;
}

const ApiResponse = ({ status, response, endpoint, method }: ApiResponseProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isSuccess = status >= 200 && status < 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 my-2 shadow-md"
    >
      <div 
        className="p-3 border-b bg-gray-50 dark:bg-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs ${
              method === 'GET' ? 'bg-blue-100 text-blue-700' :
              method === 'POST' ? 'bg-green-100 text-green-700' :
              method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {method}
            </span>
            <span className="text-xs font-mono">{endpoint}</span>
          </div>
          <div className="flex items-center">
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-xs ${
              isSuccess ? 'text-green-500' : 'text-red-500'
            }`}>
              {status}
            </span>
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-3">
              <CodeBlock code={JSON.stringify(response, null, 2)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface AuthGuideProps {
  type: string;
  example: {
    headers: Record<string, string>;
    curl?: string;
  };
}

const AuthGuide = ({ type, example }: AuthGuideProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 my-2 shadow-md">
      <h3 className="text-sm font-semibold mb-2">Authentication: {type}</h3>
      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Headers:</p>
          <CodeBlock 
            code={JSON.stringify(example.headers, null, 2)} 
            language="javascript"
          />
        </div>
        {example.curl && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">cURL Example:</p>
            <CodeBlock 
              code={example.curl} 
              language="bash"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  code: number;
  message: string;
  solution?: string;
}

const ErrorMessage = ({ code, message, solution }: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 my-2 shadow-md"
    >
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
        <div className="ml-2">
          <h3 className="text-xs font-medium text-red-800 dark:text-red-200">
            Error {code}
          </h3>
          <p className="mt-1 text-xs text-red-700 dark:text-red-300">
            {message}
          </p>
          {solution && (
            <div className="mt-1 text-xs text-red-700 dark:text-red-300">
              <strong>Solution:</strong> {solution}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ApiChatMessageProps {
  type: 'response' | 'auth' | 'error';
  content?: any;
}

export default function ApiChatMessage({ type, content }: ApiChatMessageProps) {
  return (
    <div className="space-y-2 max-w-md">
      {type === 'response' && (
        <ApiResponse
          status={200}
          method="GET"
          endpoint="/api/v1/users"
          response={{
            status: "success",
            data: {
              users: [
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Smith" }
              ]
            }
          }}
        />
      )}
      {type === 'auth' && (
        <AuthGuide
          type="Bearer Token"
          example={{
            headers: {
              'Authorization': 'Bearer YOUR_API_KEY',
              'Content-Type': 'application/json'
            },
            curl: 'curl -X POST \\\n  https://api.example.com/v1/data \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json"'
          }}
        />
      )}
      {type === 'error' && (
        <ErrorMessage
          code={401}
          message="Invalid authentication credentials"
          solution="Ensure you're using a valid API key and it's properly included in the Authorization header."
        />
      )}
    </div>
  );
}

export { CodeBlock, ApiResponse, AuthGuide, ErrorMessage };

