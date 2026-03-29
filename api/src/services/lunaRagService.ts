import OpenAI from "openai";
import { ISP_KNOWLEDGE_BASE } from "./lunaKnowledge";

// Cosine similarity helper
function cosineSimilarity(A: number[], B: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

interface ChunkDocument {
  text: string;
  embedding: number[];
}

export class LunaRagService {
  private static isInitialized = false;
  private static nvidia: OpenAI;
  private static knowledgeVectorStore: ChunkDocument[] = [];

  static async initialize() {
    if (this.isInitialized) return;
    console.log("🦾 [Luna RAG] Booting NVIDIA NIM Engine...");

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ [Luna RAG] NVIDIA_API_KEY not found in .env. RAG disabled.");
      return;
    }

    this.nvidia = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: apiKey,
    });

    console.log("🧠 [Luna RAG] Ingesting domain knowledge into RAM...");
    
    // Chunking logic (splitting by bullet points for simplicity)
    const rawChunks = ISP_KNOWLEDGE_BASE.split("\\n- ").map(c => c.trim()).filter(c => c.length > 10);
    
    // Embed the chunks
    for (const text of rawChunks) {
      try {
        const response = await (this.nvidia.embeddings.create as any)({
          model: "nvidia/nv-embedqa-e5-v5",
          input: text,
          encoding_format: "float",
          extra_body: { "input_type": "passage", "truncate": "NONE" }
        });
        this.knowledgeVectorStore.push({
          text: "- " + text,
          embedding: response.data[0].embedding,
        });
      } catch (err: any) {
        console.error("[Luna RAG] Embedding failure for chunk:", err.message);
      }
    }

    console.log(`🟢 [Luna RAG] Pipeline Online. Embedded ${this.knowledgeVectorStore.length} chunks.`);
    this.isInitialized = true;
  }

  static async ask(question: string, history: any[] = [], diagnosticContext: string = ""): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
      if (!this.isInitialized) {
        return "(Modo Mock Offline) Oi! A chave NVIDIA_API_KEY não foi configurada no servidor, então não consigo lhe atender no momento!";
      }
    }

    try {
      // 1. Embed user query
      const queryResponse = await (this.nvidia.embeddings.create as any)({
        model: "nvidia/nv-embedqa-e5-v5",
        input: question,
        encoding_format: "float",
        extra_body: { "input_type": "query", "truncate": "NONE" }
      });
      const queryEmbedding = queryResponse.data[0].embedding;

      // 2. Similarity Search (Retrieve top 2 most relevant chunks)
      const scoredDocs = this.knowledgeVectorStore.map(doc => ({
        ...doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
      }));
      scoredDocs.sort((a, b) => b.score - a.score);
      const topDocs = scoredDocs.slice(0, 2);
      
      const contextString = topDocs.map(d => d.text).join("\\n");
      console.log(`[Luna RAG] Retrieved Context Score: ${topDocs[0]?.score.toFixed(3)}`);

      // 3. Build Prompt & Call NVIDIA NIM Llama 3.1 70B
      const systemPrompt = `Você é a Luna, a assistente de IA ultramoderna da operadora Plus Internet (Brasil).
Sua personalidade é educada, tecnológica e ágil. Você resolve problemas e nunca transfere o cliente a menos que exigido.
Responda APENAS usando o "Contexto Interno" abaixo e os "Dados Ao Vivo do Cliente". 
Se o cliente pedir para 'ABRIR CHAMADO' ou se os dados indicarem Roteador Offline ou Sinal Crítico, coloque a exata palavra secreta "ABRIR_CHAMADO" no final da sua resposta.
Não mencione nomes de sistemas internos (Zabbix, TR-069, etc).

Contexto Interno da Plus (Vindo do Vector Store):
${contextString}

Dados Ao Vivo do Cliente Atual (Zabbix/OLT):
${diagnosticContext}`;

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: question }
      ];

      const completion = await this.nvidia.chat.completions.create({
        model: "meta/llama-3.1-70b-instruct",
        messages: messages,
        temperature: 0.2, // Low temp for factual ISP answers
        max_tokens: 350,
      });

      return completion.choices[0].message.content || "Desculpe, meu cérebro neural da NVIDIA desligou inesperadamente.";
    } catch (err: any) {
      console.error("[Luna RAG] Inference Error:", err.message);
      return "Estou experimentando uma alta latência cognitiva nos servidores. Pode tentar de novo em instantes?";
    }
  }
}
