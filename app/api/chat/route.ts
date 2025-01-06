import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';
import { queryEmbeddings } from '@/pinecone';

interface SearchResult {
  text: string;
}

async function getRelevantContext(query: string): Promise<string> {
  try {
    const searchResults = await queryEmbeddings(query, 2);
  
    const context: string = (searchResults as SearchResult[])
      .map((result: SearchResult) => result.text)
      .join('\n\n');
    
    return context;
  } catch (error) {
    console.error('Error retrieving context:', error);
    return ''; // Return empty string if search fails
  }
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});

export async function POST(request: Request) {
  const { messages } = await request.json();
 
  const userMessage = messages[messages.length - 1];
  const relevantContext = await getRelevantContext(userMessage.content);
  console.log('Relevant context:', relevantContext);
    
    const enhancedSystem = `You are a friendly customer service representative helping users with API-related questions.
    When users ask about available APIs, use the listAPIs function to show them.
    When users ask about specific API details, use the getAPIDetails function.
    Always interpret user questions about APIs as requests to use these functions.
    
    Here is some additional context about the APIs that might be relevant to the user's question:
    ${relevantContext}
    
    Please use this context to provide more detailed and accurate responses. When using this information:
    1. Integrate it naturally into your responses
    2. Prioritize specific details from the context over generic information
    3. If the context contains technical details, explain them in a user-friendly way
    4. If the context doesn't contain relevant information for a particular question, rely on the tools provided`;

  const result = streamText({
    model: openai('gpt-4o-2024-08-06'),  // Fixed typo in model name
    system: enhancedSystem,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}