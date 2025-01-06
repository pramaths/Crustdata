import React from 'react';
import { Button } from "@/components/ui/button";

interface ApiListProps {
  apis: string[];
  onSelectApi: (apiName: string) => void;
}

const ApiList: React.FC<ApiListProps> = ({ apis, onSelectApi }) => {
  return (
    <div className="mt-6 mb-6">
      <h2 className="text-xl font-medium mb-6 text-white">Available APIs</h2>
      <div className="grid grid-cols-1 gap-4">
        {apis.map((api) => (
          <Button
            key={api}
            variant="ghost"
            className="w-full h-16 bg-zinc-800 hover:bg-zinc-700 text-white text-left justify-start px-6 rounded-xl transition-all duration-200 group relative overflow-hidden"
            onClick={() => onSelectApi(api)}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className="w-2 h-2 bg-white rounded-full group-hover:scale-110 transition-transform" />
              <span className="text-lg">{api}</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ApiList;