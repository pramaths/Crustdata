import React from 'react';
import { Button } from "@/components/ui/button";

interface ApiListProps {
  apis: string[];
  onSelectApi: (apiName: string) => void;
}

const ApiList: React.FC<ApiListProps> = ({ apis, onSelectApi }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Available APIs</h2>
      <div className="grid grid-cols-2 gap-2">
        {apis.map((api) => (
          <Button
            key={api}
            variant="outline"
            className="text-left justify-start"
            onClick={() => onSelectApi(api)}
          >
            {api}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ApiList;

