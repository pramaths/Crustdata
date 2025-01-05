import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});

export async function POST(request: Request) {
  const { messages } = await request.json();
 
  const result = streamText({
    model: openai('gpt-4o-2024-08-06'),  // Fixed typo in model name
    system: `You are a friendly customer service representative helping users with API-related questions. 
    When users ask about available APIs, use the listAPIs function to show them.
    When users ask about specific API details, use the getAPIDetails function.
    Always interpret user questions about APIs as requests to use these functions.`,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}