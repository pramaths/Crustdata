import { tool as createTool } from 'ai';
import { z } from 'zod';
import { getNameDescription, getApiInformation } from '@/utils/api_docs';


export const listAPIs = createTool({
  description: 'Returns a list of all available API names.',
  parameters: z.object({}),  // No parameters needed
  execute: async () => {
    const apiNames = getNameDescription();
    return apiNames.map(api => api.name);
  }
});

export const getAPIDetails = createTool({
  description: 'Returns detailed information about a specific API.',
  parameters: z.object({
    apiName: z.string().describe(`The name of the API to retrieve details for and return the details properly use simple string dont use markdown.
      If its anything about ApI request put that in thriple backticks and use markdown to highlight the request.`),
  }),
  execute: async ({ apiName }) => {
    const apiDetails = getApiInformation(apiName);
    if (!apiDetails) {
      throw new Error(`API with name "${apiName}" not found.`);
    }
    return {
      name: apiDetails.name,
      description: apiDetails.description,
      path: apiDetails.path,
      method: apiDetails.method,
      headers : apiDetails.headers,
      queryParams: apiDetails.queryParams,
      responses: apiDetails.responses,
    };
  }
});

export const tools = {
  listAPIs,
  getAPIDetails,
};