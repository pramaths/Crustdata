require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {Pinecone} = require("@pinecone-database/pinecone");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY environment variable is not set');
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX || "openai-embeddings";

async function initializePinecone() {
  try {
    const indexList = await pc.listIndexes();
    if(indexList.indexes) {
    if (!indexList.indexes.some(index => index.name === indexName)) {
      console.log(`Creating new index: ${indexName}`);
      await pc.createIndex({
        name: indexName,
        dimension: 1536, 
        metric: 'cosine',
        spec: { 
          serverless: { 
            cloud: 'aws', 
            region: 'us-east-1' 
          }
        } 
      });
      
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
}
    const gethost = await pc.describeIndex(indexName);
    const createdIndex = pc.Index(indexName, gethost.host);
    return createdIndex;
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw error;
  }
}

function chunkText(text, maxChunkSize = 1000) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}


async function getEmbeddings(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

async function upsertVectors(index, vectors) {

  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    try {
      await index.upsert(batch);
      console.log(`Upserted batch ${Math.floor(i / batchSize) + 1}`);
    } catch (error) {
      console.error(
        `Error upserting batch ${Math.floor(i / batchSize) + 1, error}:`
      );
    }
  }
}

async function embedAndUpsert() {
  try {
    const index = await initializePinecone();

    const filePath = path.join(process.cwd(), "data.txt");
    const text = fs.readFileSync(filePath, "utf-8");

    const chunks = chunkText(text, 1000);
    console.log(`Total chunks created: ${chunks.length}`);
  
    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await getEmbeddings(chunk);
        vectors.push({
          id: `chunk-${i}`,
          values: embedding,
          metadata: {
            text: chunk,
          },
        });
        console.log(`Processed chunk ${i + 1}/${chunks.length}`);
      } catch (error) {
        console.error(
          `Error processing chunk ${i + 1}:`, error);
      }
    }

    await upsertVectors(index, vectors);

    console.log("All vectors upserted successfully.");
  } catch (error) {
    console.error("Error in embedAndUpsert:", error);
    throw error;
  }
}

export async function queryEmbeddings(searchText, topK = 5) {
    try {
        
        const queryEmbedding = await getEmbeddings(searchText);
        const index = pc.Index(indexName, process.env.PINECONE_HOST);
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true
        });
        
        if (!queryResponse.matches) {
            return [];
        }

        const results = queryResponse.matches.map(match => ({
            id: match.id,
            score: match.score,
            text: match.metadata?.text || '',
            similarity: match.score ? (match.score * 100).toFixed(2) + '%' : 'N/A'
        }));

        return results;
    } catch (error) {
        console.error('Error querying embeddings:', error);
        throw error;
    }
}

export async function searchDocuments(searchText) {
    try {
        const results = await queryEmbeddings(searchText);
        
        console.log('\nSearch results for:', searchText);
        console.log('----------------------------------------');
        
        results.forEach((result, index) => {
            console.log(`\n${index + 1}. Match (Similarity: ${result.similarity})`);
            console.log(`Text: ${result.text}`);
        });
        
        return results;
    } catch (error) {
        console.error('Error searching documents:', error);
        throw error;
    }
}

// embedAndUpsert();  uncommnet only first time to create index and upsert vectors