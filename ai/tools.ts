import { tool as createTool } from 'ai';
import { z } from 'zod';
import { getNameDescription, getApiInformation, getEndpoints, APINamesandDescriptions } from '@/utils/api_docs';


export const listAPIs = createTool({
  description: 'Returns a list of all available API names. here one of the string contains the name of the API and the other string contains the description of the API. Always return just the api name not the entire description.',
  parameters: z.object({}),  // No parameters needed
  execute: async () => {
    const apiNames = APINamesandDescriptions();
    return apiNames.map(api => api.name+ ' - ' + api.description);
  }
});

export const getAPIDetails = createTool({
  description: 'Returns detailed information about a specific API.',
  parameters: z.object({
    apiName: z.string().describe(`The name of the API to retrieve details for and return the details properly use simple string dont use markdown.
      If its anything about ApI request put that in thriple backticks and use markdown to highlight the request.`),
  }),
  execute: async ({ apiName }) => {
    const apiDetails = getEndpoints(apiName);
    if (!apiDetails) {
      throw new Error(`API with name "${apiName}" not found.`);
    }
    return apiDetails
  }
});

export const tools = {
  listAPIs,
  getAPIDetails,
};