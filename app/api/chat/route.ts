import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();
  
  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a friendly customer service represtative, but you are technically helping the customer with their issue only about API. You have few functions
    in tools call them properly to get the desired result.`,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}