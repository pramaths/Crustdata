import { tool as createTool } from 'ai';
import { z } from 'zod';
import {getNameDescription, getApiInformation} from '@/utils/api_docs';


export const listAPIs = createTool({
  description: 'Returns a list of all available API names.',
  parameters: z.object({
    ApiList: z.string().describe('these are the available APIs, based on the question return the API name'),
  }),
  execute: async ( ) => {
    const apiNames = getNameDescription(); // Should return an array of API names
    return apiNames;
  }
});

export const getAPIDetails = createTool({
  description: 'Returns detailed information about a specific API.',
  parameters: z.object({
    apiName: z.string().describe('The name of the API to retrieve details for.'),
  }),
  execute: async ({ apiName }) => {
    const apiDetails = getApiInformation(apiName); // Should return an object with API details
    if (!apiDetails) {
      throw new Error(`API with name "${apiName}" not found.`);
    }
    return apiDetails;
  }
});

export const tools = {
  listAPIs: listAPIs,
  getAPIDetails: getAPIDetails,
};